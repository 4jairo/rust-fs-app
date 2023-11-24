<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang='ts'>
  import { WindowLocationContext, WindowLocationTypes } from '../../../context/currentWindowContext';
  import Icons from '../../common/icons.svelte';
  import topMenuStyles from '../../common/topMenu.module.css'

  const togggleCurrentWindow = () => {
    WindowLocationContext.toggleCurrentWnidow()
  }
</script>

<header class={topMenuStyles.container}>
  
  <section on:click={togggleCurrentWindow} class="{topMenuStyles.hovereable} {topMenuStyles.changeWindowContent}">
    <div>
      <Icons icon={$WindowLocationContext === WindowLocationTypes.apps ? 'sw-right' : 'sw-left'}/>
    </div>
    <div>files</div>
  </section>
  
</header>

