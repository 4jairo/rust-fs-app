import { get, writable } from 'svelte/store'
import type { getDirContentType } from '../tauriApi/tauriApiTypes'
import { useLimitedArraySize } from '../hooks/useLimitedArraySize'
import { getDirContent, setWindowTitle } from '../tauriApi/invokeApi'
import { showErrorAlert } from '../alerts/alerts'

type CommomWindowFiltersPath = {
  path: string
  name: string
  isDirectory: boolean // true -> directory, false -> search
}
export type WindowFiltersPath = CommomWindowFiltersPath & (
  { isDirectory: true } |
  { isDirectory: false, fileList: getDirContentType[] }
)
type addDirToHistory = CommomWindowFiltersPath & {
  fileList: getDirContentType[]
}

export interface FileContextType {
  history: {
    currentPath: number
    paths: WindowFiltersPath[]
  },
  filesExt: string,
  fileList: getDirContentType[]
}

type SortItemList = (items: FileContextType['fileList']) => FileContextType['fileList']

const createFileContext = () => {
  const Store = writable<FileContextType>({
    history: {
      currentPath: -1,
      paths: [],
    },
    filesExt: '', 
    fileList: [],
  })
  
  const handleChangeCurrentHistory = async (action: 'forward' | 'back') => {
    const prevState = get(Store)
    const cantHistoryBack = prevState.history.currentPath === 0
    const cantHistoryForward = prevState.history.currentPath === prevState.history.paths.length -1

    if(action === 'forward' && cantHistoryForward || action === 'back' && cantHistoryBack) {
      return 
    }

    try {
      const {currentPath, paths} = prevState.history
      const newCurrentPathIndex = action === 'back' ? currentPath -1 : currentPath +1

      const newFileList = paths[newCurrentPathIndex].isDirectory
      ? await getDirContent(paths[newCurrentPathIndex].path)
        //@ts-ignore
      : paths[newCurrentPathIndex].fileList
      
      const filterFileExtElmt = document.getElementById('fileExtFilter-fs') as HTMLSelectElement
      filterFileExtElmt.value = ''
      

      setWindowTitle(paths[newCurrentPathIndex].path, paths[newCurrentPathIndex].name)
      Store.update((state) => ({
        filesExt: '',
        history: {
          ...state.history,
          currentPath: newCurrentPathIndex
        },
        fileList: newFileList
      }))

    } catch (error) {
      await showErrorAlert(error as string)
    }
  }

  const addDirToHistory = (items: addDirToHistory) => {
    Store.update((prevState) => {
      const { fileList, isDirectory, name, path } = items
    
      //@ts-ignore
      const newPaths = useLimitedArraySize([...prevState.history.paths], [{
        name, 
        path,
        isDirectory,
        ...(!isDirectory && { fileList })
      }], 20)

      setWindowTitle(path, name)
      return {
        history: {
          paths: newPaths,
          currentPath: newPaths.length -1
        },
        filesExt: '',
        fileList
      }
    })
  }

  const updateFileListOnCurrentDir = (fileList: FileContextType['fileList']) => {
    Store.update(prevState => ({
      ...prevState, fileList
    }))
  }

  const sortItemList = (callback: SortItemList) => {
    Store.update(prevState => ({
      ...prevState,
      fileList: [...callback(prevState.fileList)]
    }))
  }

  const updateFileExt = (newValue: string) => {
    Store.update(prevState => ({
      ...prevState,
      filesExt: newValue
    }))
  }

  return {
    subscribe: Store.subscribe,
    addDirToHistory,
    updateFileExt,
    updateFileListOnCurrentDir,
    sortItemList,
    handleChangeCurrentHistory,
  }
}

export const FileContext = createFileContext()