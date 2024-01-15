<script lang='ts'>
  import { onDestroy } from 'svelte';
  import { DirTreeLoadContext, Visibility } from '../../../context/dirTreeLoadStatus';
  import { finishedDiscoverDisk, getOsDisks, listenOsDisks } from '../../../tauriApi/invokeApi';
  import { OsDisksContext } from '../../../context/osDisks';
  import type { getOsDisksType2 } from '../../../tauriApi/tauriApiTypes';
  
  $: state = $DirTreeLoadContext
  
  const manageDisks = (list: getOsDisksType2[]) => {
    for (const item of list) {
      const [diskPath, disk] = item

      if(disk.status === 'Ejected') {
        DirTreeLoadContext.removeLoadingDisk(diskPath)
        OsDisksContext.removeOsDisk(diskPath)
        continue
      }

      if(disk.status === 'Loading') {
        DirTreeLoadContext.addLoadingDisk(diskPath)
      }
      OsDisksContext.addOsDisk(item)  
    }
  }

  // get discovered disk confirmation
  const discoveredDiskUnlisten = finishedDiscoverDisk(({ payload }) => {
    const [diskPath /*, timeEllapsed */] = payload
    DirTreeLoadContext.removeLoadingDisk(diskPath)
  })

  // gets new && deleted drives (listener)
  const newDisksUnlisten = listenOsDisks(({ payload }) => {
    manageDisks([payload])
  })

  // gets os disks (on startup)
  getOsDisks().then(manageDisks)

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
  <button class='closeProgressBar' on:click={() => DirTreeLoadContext.setModalVisibility(Visibility.invisible)}>
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