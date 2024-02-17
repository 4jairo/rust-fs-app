<script lang='ts'>
  import { FileContext } from './context/fileContext'
  import { errorListener, existentFile, getDirContent, getPathParent } from './tauriApi/invokeApi'
  import { homeDir, resolve } from '@tauri-apps/api/path'
  import { appWindow } from '@tauri-apps/api/window'
  import { onDestroy, onMount } from 'svelte'
  import { showErrorAlert } from './alerts/alerts'
  import { FileCopyContext } from './context/fileCopyContext';
  import { useSplitPath } from './hooks/useSplitPath';
  import InitKeyboardShortcut from './components/fs-app/effects/initKeyboardShortcut.svelte'
  import Icons from './components/common/icons.svelte';

  import MainContentFs from './components/fs-app/mainContent/mainContent_FsApp.svelte'
  import DirTreeLoadBarFs from './components/fs-app/effects/dirTreeLoadBar.svelte'
  import TopUtilitiesMenuFs from './components/fs-app/menus/topUtilitiesMenu.svelte'
  import PathMenuFs from './components/fs-app/menus/pathMenu.svelte'
  import BottomUtilitiesMenuFs from './components/fs-app/menus/bottomUtilitiesMenu.svelte'
  import LateralBarFs from './components/fs-app/lateralBar/lateralBar.svelte'
  import PreVisualizationFs from './components/fs-app/mainContent/preVisualization.svelte'
  import { PreVisualizationContext } from './context/preVisualization';

  const parseCliPath = async (path: string) => {
    const absolutePath = await resolve(path)
    const existent = await existentFile(absolutePath)

    if(existent.is_file) {
      const parent = await getPathParent(absolutePath)

      if(parent) {
        FileCopyContext.updateFileSelection([absolutePath])
        const name = useSplitPath(parent).pop()!
        return { path: parent, name }
      }
    }
    else if(existent.is_dir) {
      const name = useSplitPath(absolutePath).pop()!
      return { path: absolutePath, name }
    }
    
    return {
      path: await homeDir(),
      name: 'Home'
    }
  }

  $: preVisualizacionVisible = $PreVisualizationContext.visible
  let loading = true

  onMount(async () => {
    if($FileContext.history.paths.length !== 0) return

    try {
      // getting 1st path (cli arg || homeDir)
      const windowInitialName = await appWindow.title()
      const initial = windowInitialName
        ? await parseCliPath(windowInitialName)
        : {
          path: await homeDir(),
          name: 'Home'
        }

      FileContext.addDirToHistory({
        fileList: await getDirContent(initial.path),
        isDirectory: true,
        name: initial.name,
        path: initial.path
      })

      loading = false
    } catch (error) {
      showErrorAlert(error as string)
    }
  })

  // err alerts
  const unlistenErrListener = errorListener(({ payload }) => {
    showErrorAlert(payload)
  })
  onDestroy(() => {
    unlistenErrListener.then(fn => fn())
  })
</script>


{#if loading}
  <div class='loading'>
    <Icons icon='loading-gif'/>
  </div>

{:else}
  <InitKeyboardShortcut />

  <main class='root' on:contextmenu|preventDefault>
    <DirTreeLoadBarFs />
    <TopUtilitiesMenuFs />
    <PathMenuFs />
    <div class='mainContentContainer'>
      <LateralBarFs />
      <MainContentFs />
      {#if preVisualizacionVisible}
        <PreVisualizationFs />
      {/if}
    </div>
    <BottomUtilitiesMenuFs />
  </main>
{/if}

<style>
  .loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
  }
</style>