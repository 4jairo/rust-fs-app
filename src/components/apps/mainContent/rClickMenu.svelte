<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<script lang="ts">
  import { WindowLocationContext } from '../../../context/currentWindowContext';
  import { FileContext } from '../../../context/fileContext';
  import { getDirContent, searchByName } from '../../../tauriApi/invokeApi';
  import RclickStyles from '../../common/RClickMenu.module.css'
  import Icons from '../../common/icons.svelte';
  import type { RClickCommomPropsApps } from "./rClickMenuTypes";
  
  export let x: RClickCommomPropsApps['x']
  export let y: RClickCommomPropsApps['y']
  export let selectedApp: RClickCommomPropsApps['selectedApp']
  export let closeMenu: () => void

  const handleGoToFileLocation = async () => {
    console.log(selectedApp)
    
    // const fileList = await getDirContent()

    // FileContext.addDirToHistory({
    //   fileList,
    //   isDirectory: true,

    // })

    // WindowLocationContext.toggleCurrentWnidow()
  }

  const handleLaunchApp = async () => {

  }

  const handleUninstallApp = async () => {
    const coincidences = await searchByName('', selectedApp.name, false)
    console.log(coincidences)
  }

  const contentPosition = `top: ${y}px; left: ${x}px`
</script>


<div class={RclickStyles.container} on:click|stopPropagation={closeMenu} on:contextmenu|preventDefault>
  <div class={RclickStyles.content} style={contentPosition}>
    
    <section on:click={handleGoToFileLocation}>
      <div class={RclickStyles.iconContainer}>
        <Icons icon='folder' />
      </div>
      <p>Go to file location</p>
    </section>

    <section on:click={handleLaunchApp}>
      <div class={RclickStyles.iconContainer}>
        <Icons icon='launch' />
      </div>
      <p>Launch</p>
    </section>

    <section on:click={handleUninstallApp}>
      <div class={RclickStyles.iconContainer}>
        <Icons icon='remove' />
      </div>
      <p>Uninstall</p>
    </section>

    <!-- <section on:click={() => {}}>
      <div class={RclickStyles.iconContainer}>
        <Icons icon='launch' />
      </div>
      <p>Open in registry</p>
    </section> -->


  </div>
</div>

