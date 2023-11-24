<script lang='ts'>
  import { AppsContext } from '../../../context/appsContext'
  import RClickMenu from './rClickMenu.svelte'
  import CollectionItem from './collectionItem.svelte'
  import type { RClickCommomPropsApps } from './rClickMenuTypes'

  let rClickMenuProps: null | RClickCommomPropsApps = null
  $: appList = $AppsContext.appList
</script>

<div class='container'>
  {#each Object.entries(appList) as [collectionName, apps]}
    <CollectionItem 
      {collectionName} 
      {apps}
      setRclickMenu={(newMenu) => rClickMenuProps = newMenu}
    />
  {/each}
</div>
{#if rClickMenuProps}
  <RClickMenu {...rClickMenuProps} closeMenu={() => rClickMenuProps = null} />
{/if}


<style>
  .container {
    width: var(--mainContentWidth);
    height: var(--mainContentHeight);
    overflow-y: auto;
  }
</style>
  
