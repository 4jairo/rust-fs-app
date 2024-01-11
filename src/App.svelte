<script lang='ts'>
  import { FileContext } from './context/fileContext'
  import { errorListener, existentFile, getAllApps, getDirContent, getPathParent } from './tauriApi/invokeApi'
  import { homeDir, resolve } from '@tauri-apps/api/path'
  import { appWindow } from '@tauri-apps/api/window'
  import { onDestroy, onMount } from 'svelte'
  import { WindowLocationContext, WindowLocationTypes } from './context/currentWindowContext'
  import { AppsContext } from './context/appsContext'
  import { showErrorAlert } from './alerts/alerts'
  import { FileCopyContext } from './context/fileCopyContext';
  import InitKeyboardShortcut from './components/fs-app/effects/initKeyboardShortcut.svelte'
  import Icons from './components/common/icons.svelte';

  import MainContentFs from './components/fs-app/mainContent/mainContent_FsApp.svelte'
  import DirTreeLoadBarFs from './components/fs-app/effects/dirTreeLoadBar.svelte'
  import TopUtilitiesMenuFs from './components/fs-app/menus/topUtilitiesMenu.svelte'
  import PathMenuFs from './components/fs-app/menus/pathMenu.svelte'
  import BottomUtilitiesMenuFs from './components/fs-app/menus/bottomUtilitiesMenu.svelte'
  import LateralBarFs from './components/fs-app/lateralBar/lateralBar.svelte'
  import PreVisualizationFs from './components/fs-app/mainContent/preVisualization.svelte'

  import MainContentApps from './components/apps/mainContent/mainContentApps.svelte'
  import LateralBarApps from './components/apps/menus/lateralBar.svelte'
  import TopUtilitiesMenuApps from './components/apps/menus/topUtilitiesMenu.svelte'
  import { useSplitPath } from './hooks/useSplitPath';

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

  let loading = true
  $: getDisplayStatus = (displayContent: WindowLocationTypes) => (
    `display: ${$WindowLocationContext === displayContent ? 'block' : 'none'};`
  )

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
    
      // getting all apps
      const allAppList = await getAllApps()
      AppsContext.setAppList(allAppList)

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

  <main style={getDisplayStatus(WindowLocationTypes.fs)} class='root' on:contextmenu|preventDefault>
    <DirTreeLoadBarFs />
    <TopUtilitiesMenuFs />
    <PathMenuFs />
    <div class='mainContentContainer'>
      <LateralBarFs />
      <MainContentFs />
      <PreVisualizationFs />
    </div>
    <BottomUtilitiesMenuFs />
  </main>

  <main style={getDisplayStatus(WindowLocationTypes.apps)} class='root' on:contextmenu|preventDefault>
    <TopUtilitiesMenuApps />
    <div class='mainContentContainer'>
      <LateralBarApps />
      <MainContentApps />
    </div>
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