<script lang='ts'>
  import { FileContext } from './context/fileContext'
  import { getAllApps, getDirContent } from './tauriApi/invokeApi'
  import { homeDir } from '@tauri-apps/api/path'
  import { onMount } from 'svelte'
  import { WindowLocationContext, WindowLocationTypes } from './context/currentWindowContext'
  import { AppsContext } from './context/appsContext'
  import { showErrorAlert } from './alerts/alerts'
  import InitKeyboardShortcut from './components/fs-app/effects/initKeyboardShortcut.svelte'

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
  import Icons from './components/common/icons.svelte';


  let loading = true
  $: getDisplayStatus = (displayContent: WindowLocationTypes) => (
    `display: ${$WindowLocationContext === displayContent ? 'block' : 'none'};`
  )
  onMount(async () => {
    if($FileContext.history.paths.length !== 0) return

    try {
      // get /home files
      const homePath = await homeDir()
      const homeFiles = await getDirContent(homePath)

      FileContext.addDirToHistory({
        fileList: homeFiles,
        isDirectory: true,
        name: 'Home',
        path: homePath
      })

      // getting all apps
      const allAppList = await getAllApps()
      AppsContext.setAppList(allAppList)

      loading = false
    } catch (error) {
      showErrorAlert(error as string)
    }
  })
</script>


{#if loading}
  <div class='loading'>
    <Icons icon='loading-gif'/>
  </div>

{:else}

<InitKeyboardShortcut />

<main style={getDisplayStatus(WindowLocationTypes.fs)} class='root'>
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

  <main style={getDisplayStatus(WindowLocationTypes.apps)} class='root'>
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