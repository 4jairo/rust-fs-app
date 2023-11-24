<script lang='ts'>
  import { onDestroy } from 'svelte';
  import { DirTreeLoadContext } from '../../../context/dirTreeLoadStatus';
  import { finishedDiscoverDisk, listenOsDisks } from '../../../tauriApi/invokeApi';
  import { OsDisksContext } from '../../../context/osDisks';
  
  $: state = $DirTreeLoadContext

  // get discovered disk confirmation
  const discoveredDiskUnlisten = finishedDiscoverDisk(({ payload }) => {
    const [diskPath /*, timeEllapsed */] = payload
    DirTreeLoadContext.removeLoadingDisk(diskPath)
  })

  // get new disks
  const newDisksUnlisten = listenOsDisks(({ payload }) => {
    const { new: newDisks, deleted } = payload
    
    for (const { disk_path } of deleted) {
      OsDisksContext.removeOsDisk(disk_path)
      DirTreeLoadContext.removeLoadingDisk(disk_path)
    }
    
    for (const disk of newDisks) {
      OsDisksContext.addOsDisks(disk)
      if(!state.loadingDisks.includes(disk.disk_path)) {
        DirTreeLoadContext.addLoadingDisk(disk.disk_path)
      }
    }
  })

  onDestroy(() => {
    newDisksUnlisten.then(fn => fn())
    discoveredDiskUnlisten.then(fn => fn())
  })
</script>

<div class="progessBarContainer {state.visibleStatus}">
  <p>
    {state.loading
      ? `loading disks... (${state.loadingDisks.join(', ')})`
      : '✔ Done' }
  </p>
  <p class='timeCounter'>
    {(state.secondsEllapsed).toFixed(2)}
  </p>
  <button class='closeProgressBar' on:click={DirTreeLoadContext.handleCloseProgressBar}>
    &#10006;
  </button>
</div>

<style>
  .progessBarContainer {
    position: absolute;
    height: var(--pathMenuHeight);
    right: 50%;
    z-index: 1000;
    transform: translateX(50%);
    padding: 5px 80px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    background-color: rgb(16, 71, 16);
    border-bottom: solid 1px var(--borderColor);
    transition: top .1s ease;
  }
  .progessBarContainer.visible {
    top: var(--utilitiesMenuHeight);
  }
  .progessBarContainer.invisible {
    top: calc( var(--utilitiesMenuHeight) * -1 );
  }
  .timeCounter {
    position: absolute;
    bottom: 2px;
    left: 2px;
  }
  .closeProgressBar {
    all: unset;
    position: absolute;
    right: 5px;
    cursor: pointer;
  }
</style>