import { getCurrPagePaths } from "../hooks/setFilesBox";
import { FileContext } from "./fileContext";
import { FileOperationTypes, FileCopyContext, FileActionTypes, ContainerContext } from "./fileCopyContext";
import { existentFile, getDirContent, searchByName } from "../tauriApi/invokeApi";
import { useSplitPath } from "../hooks/useSplitPath";
import { WindowLocationTypes } from "./currentWindowContext";
import { get } from "svelte/store";
import { PreVisualizationContext } from "./preVisualization";
import { SearchParamsTopMenuFs } from "./searchParamsTopMenuFs";

// type keyShortcutsType = {
//   keys: string[],
// } & (
//   { currentPathDependent: true, fn: (currPath: string) => void } |
//   { currentPathDependent?: false, fn: () => void }
// )

const refreshFn = async () => {
  const { history } = get(FileContext)
  const { absoluteName } = get(SearchParamsTopMenuFs)

  const currPath = history.paths[history.currentPath]
  
  const files = currPath.isDirectory
    ? await getDirContent(currPath.path)
    : await searchByName(currPath.path, currPath.name, absoluteName)
  FileContext.updateFileListOnCurrentDir(files)
}


type keyShortcutsType = {
  keys: string[],
  fn: () => void
}
 
const keyShortcutsFs: keyShortcutsType[] = [
  {
    // copy
    keys: ['c', 'control'], 
    fn: () => FileCopyContext.changeOperation(FileOperationTypes.Copy),
  },
  {
    // cut
    keys: ['x', 'control'],
    fn: () => FileCopyContext.changeOperation(FileOperationTypes.Cut),
  },
  {
    // restore ONLY DELETED files 
    keys: ['z', 'control'],
    fn: () => FileCopyContext.executeAction(FileActionTypes.Restore)
  },
  {
    // deleted
    keys: ['delete'],
    fn: () => FileCopyContext.executeAction(FileActionTypes.Delete)
  },
  {
    // paste
    keys: ['v', 'control'],
    fn: () => FileCopyContext.executeAction(FileActionTypes.Paste)
  },
  {
    //rename file (can rename -> selectedFiles.length = 1)
    keys: ['f2'],
    fn: () => {
      const { canRename, handleRenameFile } = FileCopyContext
      if(!canRename()) return

      const { selectedFilesPath } = get(FileCopyContext)
      handleRenameFile(selectedFilesPath[0])
    },
  },
  {
    // select curr page
    keys: ['a', 'control'],
    fn: () => FileCopyContext.updateFileSelection(getCurrPagePaths()),
  },
  {
    // <- btn
    keys: ['arrowleft', 'alt'],
    fn: () => FileContext.handleChangeCurrentHistory('back')
  },
  {
    // -> btn
    keys: ['arrowright', 'alt'],
    fn: () => FileContext.handleChangeCurrentHistory('forward')
  },
  {
    // move selected path (if is selected paths < 2)
    keys: ['arrowdown'],
    fn: () => FileCopyContext.handleArrowKeys(false)
  },
  {
    // move selected path (if is selected paths < 2)
    keys: ['arrowup'],
    fn: () => FileCopyContext.handleArrowKeys(true)
  },
  {
    keys: ['control', 'shift', 'n'],
    fn: () => {
      const { history } = get(FileContext)
      const currPath = history.paths[history.currentPath].path
      FileCopyContext.handleCreateFile('file', currPath)
    }
  },
  {
    // open file (if only one)
    keys: ['enter'],
    fn: async () => {
      const { canRename, handleOpenFile } = FileCopyContext
      if(!canRename()) return

      const { selectedFilesPath, containerContext } = get(FileCopyContext)

      if([
        ContainerContext.PathMenu,
        ContainerContext.TopUtilitiesMenu
      ].includes(containerContext)) return
      
      const { is_file } = await existentFile(selectedFilesPath[0])
      const name = useSplitPath(selectedFilesPath[0]).pop()!
      handleOpenFile(is_file, selectedFilesPath[0], name)
    }
  },
  {
    keys: ['alt', 'z'],
    fn: () => {
      const { containerContext } = get(FileCopyContext)
      if(containerContext === ContainerContext.PreVisualization) {
        PreVisualizationContext.update(prev => ({ ...prev, altZ: !prev.altZ }))
      }
    }
  },
  {
    keys: ['control', 'f'],
    fn: () => {
      const filterInputElmnt = document.getElementById('filterQueryFilter-fs') as HTMLInputElement
      filterInputElmnt.focus()
    }
  },
  {
    keys: ['f5'],
    fn: refreshFn
  },
  {
    keys: ['control', 'r'],
    fn: refreshFn
  }
]

const keyShortcutsApps: keyShortcutsType[] = []

const findKey = (keys: keyShortcutsType['keys'], currKeys: string[]) => {
  const sortedKEys = keys.sort()

  if (currKeys.length !== sortedKEys.length) return false

  for (let i = 0; i < currKeys.length; i++) {
    if(currKeys[i] !== sortedKEys[i]) return false
  }

  return true
}

export function findKeyCombination(currentKeys: string[], windowContext: WindowLocationTypes) {
  const currKeys = currentKeys.sort()

  return windowContext === WindowLocationTypes.fs
    ? keyShortcutsFs.find(({ keys }) => findKey(keys, currKeys))
    : keyShortcutsApps.find(({ keys }) => findKey(keys, currKeys))
}