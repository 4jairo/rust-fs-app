<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<script lang='ts'>
  import { FileContext } from '../../../context/fileContext';
  import { getDirContent } from '../../../tauriApi/invokeApi';
  import { getConstantDirs } from '../../../tauriApi/getConstantPaths';
  import MenuSeparation from '../../common/menuSeparation.svelte';
  import lateralBarStyles from '../../common/lateralBar.module.css'
  import { showErrorAlert } from '../../../alerts/alerts';
  import { OsDisksContext } from '../../../context/osDisks';
  import { handleResizeBar } from '../../../hooks/handleResizeBar';
  import type { MouseEv } from '../../common/eventListenerTypes';
  import { ContainerContext, FileCopyContext } from '../../../context/fileCopyContext';
 
  $: fileContextHistory = $FileContext.history
  $: currentPath = fileContextHistory.paths[fileContextHistory.currentPath]

  $: isOnCurrentPath = (path: string) => {
    return currentPath.isDirectory && currentPath.path === path
  }

  // get path content
  const handleClick = async (dirName: string, dirPath: string) => {
    getDirContent(dirPath)
    .then(dirItems => {
      FileContext.addDirToHistory({
        fileList: dirItems,
        isDirectory: true,
        name: dirName,
        path: dirPath
      })
    })
    .catch((err) => showErrorAlert(err))
  }

  // used gb's bar on drives
  const usedCapacityPercent = (maxCapacity: string, freeSpace: string) => {
    const parsedMaxCapacity =  Number(maxCapacity.split(' ').shift())
    const parsedFreeSpace = Number(freeSpace.split(' ').shift())
    return (parsedMaxCapacity - parsedFreeSpace) * 100 / parsedMaxCapacity
  }

  //resize 
  const handleResize = (e: MouseEv<HTMLDivElement>) => {
    handleResizeBar({
      clickEvent: e,
      barName: '--lateralBarWidth',
      directionInverted: false
    })
  }

  const updateContainerContext = () => {
    FileCopyContext.updateContainerContext(ContainerContext.LateralBar)
  }
</script>

<div class={lateralBarStyles.container} on:click={updateContainerContext}>
  <div class={lateralBarStyles.content}>
    <h3>· Quick acces</h3>
  
    {#await getConstantDirs() then dirs}
    {#each Object.entries(dirs) as [dirName, dirPath]}
      <button on:click={() => handleClick(dirName, dirPath)} class={isOnCurrentPath(dirPath) ? 'onCurrentPath' : ''}>
        {dirName}
      </button>
    {/each}
    {/await}
  
    <MenuSeparation />
    <h3>· Drives:</h3>
    
    {#each $OsDisksContext.disks as {disk_path, free_space, max_capacity, name}}
      <button on:click={() => handleClick(name, disk_path)} class={isOnCurrentPath(disk_path) ? 'onCurrentPath' : ''}>
        {name || 'Local disk'} ( {disk_path} )
      </button>
  
      <div class='diskSpaceBar'>
        <div class='diskUsedBar' style="width: {usedCapacityPercent(max_capacity, free_space)}%"></div>
        <span>{free_space} of {max_capacity}</span>
      </div>
    {/each}
  </div>

  <div class={lateralBarStyles.resizeBar} on:mousedown={handleResize}></div>
</div>

<style>
  .diskSpaceBar {
    height: 17px;
    width:  95%;
    background-color: #fff;
    margin: 0 auto 10px auto;
    position: relative;
  }
  .diskSpaceBar > span {
    position: absolute;
    font-size: 13px;
    font-weight: 550;
    top: 0;
    color: black
  }
  .diskUsedBar {
    padding: 0;
    height: 100%;
    background-color: green;
  }
  .onCurrentPath {
    background-color: var(--borderColorLight);
  }
</style>