import type { RCLickOptionsType } from "./directoryFilesProps";
import { FileOperationTypes, FileCopyContext, FileActionTypes } from "../../../context/fileCopyContext";
import { getPathParent, openFile, openTerminal, openWindowsFs } from "../../../tauriApi/invokeApi";
import { showErrorAlert } from "../../../alerts/alerts";

export const getRclickOptions = async (isFile: boolean, selectedPath: string) => {
  const handleOpenTerminal = async () => {
    await openTerminal(
      isFile
        ? await getPathParent(selectedPath) as string
        : selectedPath
    )
  }

  const copyPathToClipboard = () => {
    navigator.clipboard.writeText(selectedPath)
    .catch(err => showErrorAlert(err))
  }

  const isExe = () => {
    const fileExt = selectedPath.split('.').pop()!.toLowerCase()
    return isFile && ['exe', 'lnk'].includes(fileExt)
  }

  const folderPath = isFile
  ? await getPathParent(selectedPath) as string
  : selectedPath

  return [
    { 
      title: 'Open as admin', 
      icon: 'admin', 
      fn: () => openFile(selectedPath, true), 
      condition: isExe(), 
      separation: true 
    },
    //--------------------------------------------------------------
    { 
      title: 'Windows Explorer', 
      icon: 'folder-open',
      fn: async () => await openWindowsFs(isFile, isFile ? selectedPath : folderPath), 
    },
    {
      title: 'Copy Path',
      icon: 'copy-path',
      fn: copyPathToClipboard,
      separation: true 
    },
    //--------------------------------------------------------------
    { 
      title: 'New Folder', 
      icon: 'new-folder', 
      fn: () => FileCopyContext.handleCreateFile('folder', folderPath)
    },
    {
      title: 'New File',
      icon: 'new-file', 
      fn: () => FileCopyContext.handleCreateFile('file', folderPath), 
      separation: true 
    },
    //--------------------------------------------------------------
    {
      title: 'Rename', 
      icon: 'edit', 
      fn: () => FileCopyContext.handleRenameFile(selectedPath),
      condition: FileCopyContext.canRename()
    },
    { 
      title: 'Copy', 
      icon: 'copy', 
      fn: () => FileCopyContext.changeOperation(FileOperationTypes.Copy)
    },
    { 
      title: 'Cut', 
      icon: 'cut', 
      fn: () => FileCopyContext.changeOperation(FileOperationTypes.Cut)
    },
    { 
      title: 'Paste',
      icon: 'paste', 
      fn: () => FileCopyContext.executeAction(FileActionTypes.Paste),
      condition: FileCopyContext.canPaste()
    },
    {
      title: 'Delete',
      icon: 'remove',
      fn: () => FileCopyContext.executeAction(FileActionTypes.Delete), 
      separation: true
    },
    //--------------------------------------------------------------
    { 
      title: isFile ? 'Terminal on folder' : 'Terminal', 
      icon: 'terminal', 
      fn: handleOpenTerminal 
    },
  ] as RCLickOptionsType[]
}
