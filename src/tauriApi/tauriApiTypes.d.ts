import type { UnlistenFn } from '@tauri-apps/api/event'
import { CopyRenameRules } from './invokeApi'

export interface getOsDisksType {
  name: string
  format: string
  status: 'Loading' | 'Loaded' | 'Ejected'
  free_space: string
  max_capacity: string
}
export type getOsDisksType2 = [string, getOsDisksType]

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
export interface getAllAppsType {
  [collectionName: string]: ApplicationType[]
}

export interface TauriListenerEvent<T> {
  event: string,
  id: number,
  windowLabel: string,
  payload: T
}



export namespace invokeApi {
  type error = (cb: (event: TauriListenerEvent<string>) => void) => Promise<UnlistenFn>

  //! 1.- disks & dirTree changes
  type osDisksChange = (callback: (newDiskList: TauriListenerEvent<getOsDisksType2[]>) => void) => Promise<UnlistenFn> 
  // not err

  type getOsDisks = () => Promise<getOsDisksType2[]>
  

  type dirTreeChange = (callback: (event: TauriListenerEvent<string>) => void) => Promise<UnlistenFn>
  // not err
  
  type finishedDiscoverDisk = (cb: (e: TauriListenerEvent<[string, number]>) => void) => Promise<UnlistenFn>
  // not err

  //! 2.- get files/dirs
  type getDirContent = (path: string) => Promise<getDirContentType[]> // -> error -> null

  type searchByName = (path: string, fileName: string, onlyAbsolute: boolean) => Promise<getDirContentType[]>

  //! 3.- modify files/dirs
  type openFile = (filePath: string, administrator?: boolean) => Promise<null> // error -> string

  type createFile = (path: string, isFile: boolean) => Promise<null> // error -> string

  type renameFile = (fromPath: string, newName: string) => Promise<null> // error -> string

  type moveFile = (file_paths: string[], new_dir: string, copyRules?: CopyRenameRules) => Promise<null> // error -> string
  type copyFile = (file_paths: string[], new_dir: string, copyRules?: CopyRenameRules) => Promise<null> // error -> string

  //move to trash

  //restore

  //! 4.- utils (fs) 
  type openTerminal = (path: string) => Promise<null> // error -> string

  //open windows fs

  type existentFile = (path: string) => Promise<{ is_file: boolean, is_dir: boolean }>
  
  type getPathParent = (path: string) => Promise<string | null> 

  type startOnBootChangeListener = (cb: (e: TauriListenerEvent<boolean>) => void) =>  Promise<UnlistenFn>

  type startOnBootChange = (newValue: boolean) => Promise<void>
  
  //auto complete

  //! apps
  type getAllApps = () => Promise<getAllAppsType>
}