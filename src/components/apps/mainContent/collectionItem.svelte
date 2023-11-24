<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang='ts'>
  import type { ApplicationType } from '../../../tauriApi/tauriApiTypes';
  import type { MouseEv } from '../../common/eventListenerTypes';
  import type { RClickCommomPropsApps } from './rClickMenuTypes';
  import Icons from '../../common/icons.svelte';

  export let collectionName: string
  export let apps: ApplicationType[]
  export let setRclickMenu: (newMenu: RClickCommomPropsApps) => void

  const handleSetMenu = (event: MouseEv<HTMLDivElement>, app: ApplicationType) => {
    const { pageX, pageY } = event

    setRclickMenu({
      x: pageX, y: pageY, 
      selectedApp: app
    })
  }

  let visibleStatus = false
  const toggleVisibleStatus = () => {
    visibleStatus = !visibleStatus
  }
  $: visibleStyle = `height :${visibleStatus ? '100%' : 0 };`
  $: iconRotation = `transform: rotate(${visibleStatus ? '0' : '-90'}deg)`
</script>

<div class='collectionItem' on:click={toggleVisibleStatus}>
  <div class='collectionHeader'>
    <div style={iconRotation}><Icons icon='caret' size={20}/></div>
    <b>{collectionName}</b>
  </div>
  
  <div on:click|stopPropagation class='collectionContainer' style={visibleStyle}>
    {#each apps as app}
    <div on:contextmenu|preventDefault={(e) => handleSetMenu(e, app)}>
      <span>&rarr;</span>
      <span>{app.name}</span>
      <span>{app.publisher}</span>
      <span>{app.version}</span>
    </div>
  
    {/each}
  </div>
</div>




<style>
  .collectionItem {
    padding: 5px;
    min-height: 45px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .collectionHeader {
    position: relative;
    display: flex;
  }
  .collectionHeader > :not(div) {
    padding-left: 30px;
  }
  .collectionHeader > div {
    position: absolute;
    transition: transform .1s ease;
  }

  .collectionContainer {
    overflow: hidden;
    border-bottom: solid 1px var(--borderColor);
  }
</style>