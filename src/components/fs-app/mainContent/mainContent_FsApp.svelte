<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<script lang='ts'>
  import DirectoryFiles from './directoryFiles.svelte'
  import { FileContext } from '../../../context/fileContext'
  import { onDestroy } from 'svelte';
  import { getDirContent, listenDirTreeChange } from '../../../tauriApi/invokeApi';
  import { arePathsEqual } from '../../../hooks/useSplitPath'
  import { PaginationContext } from '../../../context/pagination';
  import { RClickMenuContextFs } from '../../../context/rclickMenuFs';
  import { getRclickOptions } from './RClickMenuOptions';
  import RClickMenu from './RClickMenu.svelte';
  import { ContainerContext, FileCopyContext } from '../../../context/fileCopyContext';
  import { showErrorAlert } from '../../../alerts/alerts';
  import type { MouseEv } from '../../common/eventListenerTypes';
  import { ShortcutKeysContext } from '../../../context/shortcutKey';
  import { selectFilesBox } from '../../../hooks/setFilesBox';

  $: rClickMenu = $RClickMenuContextFs
  
  $: fileContext = $FileContext
  $: currPath = fileContext.history.paths[fileContext.history.currentPath]

  $: {
    currPath
    PaginationContext.resetPagination()
  }

  // listen for changes
  // updatedPath === dir of the change (ex: modify C:/example.txt -> updatedPath = C:/)
  const unlistenDirTreeChange = listenDirTreeChange(({ payload: updatedPath }) => {
    
    // if not current path || currently in a search
    if(!arePathsEqual(updatedPath, currPath.path) || !currPath.isDirectory) {
      return
    }

    getDirContent(updatedPath)
      .then(FileContext.updateFileListOnCurrentDir)
      .catch(showErrorAlert)
  })

  //change context
  const updateContainerContext = () => {
    FileCopyContext.updateContainerContext(ContainerContext.DirectoryFiles)
  }

  const handleSelectFiles = async (e: MouseEv<HTMLDivElement>) => {
    const ctrlPressed = $ShortcutKeysContext.keys.includes('control')
    if(!ctrlPressed) FileCopyContext.updateFileSelection([])

    const pathSelection = await selectFilesBox(e)
    FileCopyContext.updateFileSelection(pathSelection, ctrlPressed)
  }

  onDestroy(() => unlistenDirTreeChange.then(fn => fn()))
</script>


<div id="mainContent-fs-parent" 
  on:contextmenu|preventDefault={(e) => RClickMenuContextFs.set(e, currPath.path, false)}
  on:click={updateContainerContext} 
>
  {#key fileContext}
    <DirectoryFiles {currPath}/>
  {/key}

  <div class="flex-grow" on:mousedown={handleSelectFiles}></div>
</div>


<!-- RClick menu -->
{#if rClickMenu}
  {#await getRclickOptions(rClickMenu.isFile, rClickMenu.selectedPath) then rCLickOptions}
    <RClickMenu x={rClickMenu.x} y={rClickMenu.y} {rCLickOptions}/>
  {/await}
{/if}

<style>
  #mainContent-fs-parent {
    width: var(--mainContentWidth);
    height: var(--mainContentHeight);
    position: relative;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  
  .flex-grow {
    flex-grow: 1;
  }
</style>
