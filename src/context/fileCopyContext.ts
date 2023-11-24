import { get, writable } from "svelte/store"
import { useSplitPath } from "../hooks/useSplitPath"
import { duplicatePathAlert, existentFileNotification, getUserInputAlert, removeFileConfirmation } from "../alerts/alerts"
import { CopyRenameRules, copyFile, createFile, existentFile, getAutoComplete, moveFile, moveToTrash, openFile, renameFile, restoreLastDeletedFile } from "../tauriApi/invokeApi"
import { join } from "@tauri-apps/api/path"
import { FileContext } from "./fileContext"
import { handleOpenFolder } from "../hooks/hanldeOpenFolder"
import { handleAutoScroll } from "../hooks/setFilesBox"

export const enum FileOperationTypes {
  Copy,
  Cut
}

export const enum FileActionTypes {
  Paste,
  Delete,
  Restore
}

export const enum ContainerContext {
  DirectoryFiles,
  TopUtilitiesMenu,
  PathMenu,
  LateralBar,
  Footer,
  PreVisualization,
  Other
}

interface FileCopyContext {
  selectedFilesPath: string[],
  _tempSelectedFiles: string[],
  operation?: {
    operationFilePaths: string[]
    type: FileOperationTypes
  },
  containerContext: ContainerContext
}

const createContext = () => {
  const State = writable<FileCopyContext>({ 
    selectedFilesPath: [],
    _tempSelectedFiles: [],
    containerContext: ContainerContext.Other
  })

  //! boolean conditions
  const canPaste = () => {
    const { operation } = get(State)
    if(operation) return operation.operationFilePaths.length > 0
    return false
  }

  const canRename = () => {
    const { selectedFilesPath } = get(State)
    return selectedFilesPath.length === 1
  }

  //! update state
  const changeOperation = (o: FileOperationTypes) => State.update(prev => ({
    ...prev, 
    operation: {
      operationFilePaths: [...prev.selectedFilesPath],
      type: o
    }
  }))
  
  const updateFileSelection = (files: string[], controlPressed?: boolean) => {
    State.update(prev => {
      if(files.length === 1 && controlPressed) {
        return {
          ...prev,
          selectedFilesPath: prev.selectedFilesPath.filter(path => {
            return path !== files[0]
          })
        }
      }

      return {
        ...prev,
        selectedFilesPath: controlPressed
          ? Array.from(new Set(prev.selectedFilesPath.concat(files)))
          : files
      }
    })
  }

  const updateTempFiles = (files: string[]) => {
    State.update(prev => ({
      ...prev, _tempSelectedFiles: files
    }))
  }

  const updateContainerContext = (newC: ContainerContext) => {
    State.update(prev => ({
      ...prev, containerContext: newC
    }))
  }

  //! modify files
  const handleCreateFile = async (kind: 'file' | 'folder', parentPath: string) => {
    const { isConfirmed, value: newName } = await getUserInputAlert({
      title: `New ${kind}`,
      inputPlaceholder: 'name:'
    })
    if(!isConfirmed) return

    const newFilePath = await join(parentPath, newName)
    const fileSearch = await existentFile(newFilePath)

    if(fileSearch.is_file || fileSearch.is_dir) {
      await existentFileNotification(newName)
      return
    }
    
    await createFile(newFilePath, kind === 'file')
  }

  const handleRenameFile = async (filePath: string) => {
    const prevPath = useSplitPath(filePath)
    const prevName = prevPath.pop()!

    const { isConfirmed, value } = await getUserInputAlert({
      title: 'New name',
      inputPlaceholder: 'name: ',
      inputValue: prevName
    })
    if(!isConfirmed) return

    const newNamePath = prevPath.concat(value).join('\\')
    const isExistent = await existentFile(newNamePath)

    if(isExistent.is_dir || isExistent.is_file) {
      await existentFileNotification(value)
      return
    }
    //              fromPath, newName
    await renameFile(filePath, value)
  }

  const moveFilesToTrash = async (paths: string[]) => {
    const { isConfirmed } = await removeFileConfirmation(paths.length > 1)
    if(!isConfirmed) return

    await moveToTrash(paths)
  }

  const handlePasteFiles = async () => {
    const { operation } = get(State)
    if(!operation) return

    // curr path && selected files name
    const { history } = get(FileContext)
    const currPath = history.paths[history.currentPath].path
    const selectedFilesName = operation.operationFilePaths.map(path => {
      return useSplitPath(path).pop()!
    })

    let copyRules: CopyRenameRules | undefined = undefined

    // duplicated names
    const someDuplicate = (await getAutoComplete(currPath))
    .filter(path => selectedFilesName.includes(path))


    if(someDuplicate.length > 0) {
      const result = await duplicatePathAlert(someDuplicate)
      if (!result) return

      copyRules = result
    }

    // paste if not duplicate
    if (operation.type === FileOperationTypes.Copy) {

      await copyFile(operation.operationFilePaths, currPath, copyRules)
    } else if(operation.type === FileOperationTypes.Cut) {

      await moveFile(operation.operationFilePaths, currPath, copyRules)
      State.update(prevState => ({
        ...prevState, 
        operation: undefined,
        selectedFilesPath: []
      }))
    }
  }

  const executeAction = async (action: FileActionTypes) => {
    if (action === FileActionTypes.Delete) {
      const { selectedFilesPath } = get(State)
      await moveFilesToTrash(selectedFilesPath)
      State.update(prev => ({ ...prev, selectedFilesPath: [] }))       
    }
    else if (action === FileActionTypes.Restore) {
      await restoreLastDeletedFile()
    }
    else if (action === FileActionTypes.Paste) {
      await handlePasteFiles()
    }       
  }

  const handleOpenFile = async (isFile: boolean, path: string, name: string) => {
    if (isFile) {
      await openFile(path)
    } else {
      await handleOpenFolder(name, path)
    }
  }

  const handleArrowKeys = (isKeyUp: boolean) => {
    const ammount = isKeyUp ? -1 : 1
    const { fileList } = get(FileContext)

    State.update(prevState => {
      // if 0 paths selected
      if(prevState.selectedFilesPath.length === 0) {
        handleAutoScroll(fileList[0].path)
        return { ...prevState, selectedFilesPath: [fileList[0].path] }
      }
      
      // +1 selected pahts
      const lastSelectedPath = prevState.selectedFilesPath[prevState.selectedFilesPath.length -1]
      const selectedPathIndex = fileList.findIndex(p => p.path === lastSelectedPath)

      if(selectedPathIndex === -1) {
        handleAutoScroll(fileList[0].path)
        return { ...prevState, selectedFilesPath: [fileList[0].path] }
      }

      // path in current dir
      if(
        (!isKeyUp && fileList.length -1 === selectedPathIndex) ||
        (isKeyUp && selectedPathIndex === 0)
      ) return prevState
      
      const newPath = fileList[selectedPathIndex + ammount].path
      handleAutoScroll(newPath)
      return { ...prevState, selectedFilesPath: [newPath]}
    })
  }
  
  return {
    executeAction,
    changeOperation,
    canPaste,
    canRename,
    updateFileSelection,
    updateTempFiles,
    updateContainerContext,
    handleRenameFile,
    handleCreateFile,
    handleArrowKeys,
    handleOpenFile,
    subscribe: State.subscribe,
  }
}

export const FileCopyContext = createContext()