import { invoke } from '@tauri-apps/api';
import type { invokeApi } from './tauriApiTypes';
import { listen } from '@tauri-apps/api/event';
import { showErrorAlert } from '../alerts/alerts';

export const enum CopyRenameRules { 
  OverWrite = 'OverWrite', 
  CreateNewName = 'CreateNewName',
  Skip = 'Skip'
}

const enum INVOKE_TYPES {
  error = 'error_listener',

  //! 1.- disks & dirTree changes
  osDisksChange = 'os_disks_listener',
  getOsDisks = 'get_os_disks',
  dirTreeChange = 'dir_tree_change',
  finishedDiscoverDisk = 'finish_discover_disk',

  //! 2.- get files/dirs
  getDirContent = 'get_dir_content',
  searchByName = 'search_by_name',

  //! 3.- modify files/dirs
  openFile = 'open_file',
  createFile = 'create_file',
  renameFile = 'rename_file',
  moveFile = 'move_file',
  moveToTrash = 'move_to_trash',
  restoreLastDeletedFile = 'restore_file',
  copyFile = 'copy_file',
  getFileContent = 'get_file_content',
  getImgBlob = 'get_img_blob',

  //! 4.- utils (fs)
  openTerminal = 'open_terminal',
  openWindowsFs = 'open_windows_fs',
  existentfile = 'existent_file',
  getPathParent = 'get_path_parent',
  getAutoComplete = 'get_autocomplete',
  startOnBootChange = 'start_on_boot_change',
  startOnBootChangeListener = 'start_on_boot_listener',
  setWindowTitle = 'set_window_title',

  //! apps
  getAllApps = 'get_all_apps',
}


export const errorListener: invokeApi.error = async (cb) => {
  //@ts-ignore
  return await listen(INVOKE_TYPES.error, cb)
}

//! 1.- disks & dirTree
export const listenOsDisks: invokeApi.osDisksChange = async (cb) => {
  //@ts-ignore
  return await listen(INVOKE_TYPES.osDisksChange, cb)
}

export const getOsDisks: invokeApi.getOsDisks = async () => {
  return await invoke(INVOKE_TYPES.getOsDisks)
}

export const listenDirTreeChange: invokeApi.dirTreeChange = async (cb) => {
  try {
    //@ts-ignore
    return await listen(INVOKE_TYPES.dirTreeChange, cb)
  } catch (error) {
    await showErrorAlert(error as string)
    return () => {}
  }
}

export const finishedDiscoverDisk: invokeApi.finishedDiscoverDisk = async (cb) => {
  //@ts-ignore
  return await listen(INVOKE_TYPES.finishedDiscoverDisk, cb)
}

//! 2.- get files/dirs
export const getDirContent: invokeApi.getDirContent = async (path) => {
  return invoke(INVOKE_TYPES.getDirContent, { path })
}

export const searchByName: invokeApi.searchByName = async (path, fileName, onlyAbsolute) => {
  try {
    return await invoke(INVOKE_TYPES.searchByName, { 
      path, fileName, onlyAbsolute
    })
  } catch (error) {
    await showErrorAlert(error as string)
    return []
  }
}


//! 3.- modify files/dirs
export const openFile: invokeApi.openFile = async (filePath, administrator) => {
  try {
    return await invoke(INVOKE_TYPES.openFile, { filePath, administrator: administrator ?? false })
  } catch (error) {
    await showErrorAlert(error as string)
    return null
  }
}

export const createFile: invokeApi.createFile = async (path, isFile) => {
  try {
    return await invoke(INVOKE_TYPES.createFile, { path, isFile }) 
  } catch (error) {
    await showErrorAlert(error as string)
    return null
  }
}

export const renameFile: invokeApi.renameFile = async (fromPath, newName) => {
  try {
    return await invoke(INVOKE_TYPES.renameFile, { from: fromPath, newName })
  } catch (error) {
    await showErrorAlert(error as string)
    return null
  }
}

export const moveFile: invokeApi.moveFile = async (paths, newDir, copyRules) => {
  try {
    return await invoke(INVOKE_TYPES.moveFile, { 
      filePaths: paths, newDir, copyRules: copyRules ?? ''
    })
  } catch (error) {
    await showErrorAlert(error as string)
    return null
  }
}

export const copyFile: invokeApi.copyFile = async (paths, newDir, copyRules) => {
  try {
    return await invoke(INVOKE_TYPES.copyFile, {
      filePaths: paths, newDir, copyRules: copyRules ?? ''
    })
  } catch (error) {
    await showErrorAlert(error as string)
    return null
  }
}

export const restoreLastDeletedFile = async () => {
  return await invoke(INVOKE_TYPES.restoreLastDeletedFile)
}

export const moveToTrash = async (paths: string[]) => {
  return await invoke(INVOKE_TYPES.moveToTrash, { paths })
}

export const getFileContent = async (filePath: string) => {
  try {
    return filePath
      ? await invoke(INVOKE_TYPES.getFileContent, { filePath }) as string
      : ''
  } catch (error) {
    return error as string
  }
}

export const getImgBlob = async (imgPath: string) => {
  try {
    return await invoke(INVOKE_TYPES.getImgBlob, { imgPath }) as Uint8Array
  } catch (error) {
    await showErrorAlert(error as string)
  }
}


//! 4.- utils (fs)
export const openTerminal: invokeApi.openTerminal = async (path) => {
  try {
    return await invoke(INVOKE_TYPES.openTerminal, { path })
  } catch (error) {
    await showErrorAlert(error as string)
    return null
  }
}

export const existentFile: invokeApi.existentFile = async (path) => {
  return await invoke(INVOKE_TYPES.existentfile, { path })
}

export const getPathParent: invokeApi.getPathParent = async (path) => {
  try {
    return await invoke(INVOKE_TYPES.getPathParent, { path })
  } catch (_) {
    return null
  }
}

export const openWindowsFs = async (isFile: boolean, filePath: string) => {
  return await invoke(INVOKE_TYPES.openWindowsFs, { isFile, filePath })
}

export const getAutoComplete = async (path: string) => {
  const result = await invoke(INVOKE_TYPES.getAutoComplete, { path })
  return result as string[]
}

export const startOnBootChangeListener: invokeApi.startOnBootChangeListener = async (cb) => {
  //@ts-ignore
  return await listen(INVOKE_TYPES.startOnBootChangeListener, cb)
}

export const startOnBootNotify: invokeApi.startOnBootChange = async (newValue) => {
  await invoke(INVOKE_TYPES.startOnBootChange, { newValue })
}

export const setWindowTitle = async (path: string, name: string) => {
  const title = path && name
    ? `(${name}) ${path}`
    : path || `🔍(${name})`

  await invoke(INVOKE_TYPES.setWindowTitle, { title })
}

//! apps
export const getAllApps: invokeApi.getAllApps = async () => {
  try {
    return await invoke(INVOKE_TYPES.getAllApps)
  } catch (error) {
    await showErrorAlert(error as string)
    return {}
  }
}
