import type { UnlistenFn } from '@tauri-apps/api/event'
import { CopyRenameRules } from './invokeApi'

export interface getOsDisksType {
  name: string
  format: string
  disk_path: string
  free_space: string
  max_capacity: string
}
export interface CompareOsDisksType {
  new: getOsDisksType[],
  deleted: getOsDisksType[]
}

export interface getDirContentType {
  path: string
  name: string
  is_file: boolean
  byte_size: number
  last_modified: number
}

export interface ApplicationType {
  name: string
  publisher: string
  location: string,
  version: string
  uninstall_string: string
  icon: string
}
export interface getAllApps {
  [collectionName: string]: ApplicationType[]
}

export interface TauriListenerEvent<T> {
  event: string,
  id: number,
  windowLabel: null,
  payload: T
}



export interface invokeApi {
  //! 1.- disks & dirTree changes
  osDisksChange: (callback: (newDiskList: TauriListenerEvent<CompareOsDisksType>) => void) => Promise<UnlistenFn> 
  // not err

  dirTreeChange: (callback: (event: TauriListenerEvent<string>) => void) => Promise<UnlistenFn>
  // not err
  
  finishedDiscoverDisk: (cb: (e: TauriListenerEvent<[string, number]>) => void) => Promise<UnlistenFn>
  // not err

  //! 2.- get files/dirs
  getDirContent: (path: string) => Promise<getDirContentType[]> // -> error -> null

  searchByName: (path: string, fileName: string, onlyAbsolute: boolean) => Promise<getDirContentType[]>

  //! 3.- modify files/dirs
  openFile: (filePath: string, administrator?: boolean) => Promise<null> // error -> string

  createFile: (path: string, isFile: boolean) => Promise<null> // error -> string

  renameFile: (fromPath: string, newName: string) => Promise<null> // error -> string

  moveFile: (file_paths: string[], new_dir: string, copyRules?: CopyRenameRules) => Promise<null> // error -> string
  copyFile: (file_paths: string[], new_dir: string, copyRules?: CopyRenameRules) => Promise<null> // error -> string

  //move to trash

  //restore

  //! 4.- utils (fs) 
  openTerminal: (path: string) => Promise<null> // error -> string

  //open windows fs

  existentFile: (path: string) => Promise<{ is_file: boolean, is_dir: boolean }>
  
  getPathParent: (path: string) => Promise<string | null> 
  
  //auto complete

  //! apps
  getAllApps: () => Promise<getAllApps>
}