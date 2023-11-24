<!--svelte-ignore a11y-no-static-element-interactions-->
<!--svelte-ignore a11y-click-events-have-key-events-->

<script lang='ts'>
  import type { RCLickOptionsType, RClickCommomPropsFs } from './directoryFilesProps'
  import RclickStyles from '../../common/RClickMenu.module.css'
  import Icons from '../../common/icons.svelte'
  import { onMount } from 'svelte'
  import { RClickMenuContextFs } from '../../../context/rclickMenuFs';

  export let x: RClickCommomPropsFs['x']
  export let y: RClickCommomPropsFs['y']
  export let rCLickOptions: RCLickOptionsType[]

  let contentPosition = { x,y }
  $: getContentPosition = () => {
    const percentX = contentPosition.x / window.innerWidth * 100
    const percentY = contentPosition.y / window.innerHeight * 100
    
    return `top: ${percentY}%; left: ${percentX}%`
  }
  
  onMount(() => {
    const rClickContentElement = document.getElementById('rClickMenu-fs') as HTMLDivElement
    const { offsetHeight, offsetWidth } = rClickContentElement

    if(offsetWidth + x > window.innerWidth) contentPosition.x -= offsetWidth
    if(offsetHeight + y > window.innerHeight) contentPosition.y -= offsetHeight
  })
</script>

<div
  class="container"
  on:click|stopPropagation={RClickMenuContextFs.hideMenu} 
  on:contextmenu|preventDefault={RClickMenuContextFs.hideMenu}
>
  <div
    id="rClickMenu-fs" 
    class={RclickStyles.content}
    style={getContentPosition()}
    on:contextmenu|stopPropagation|preventDefault
  >
    {#each rCLickOptions as { condition, fn, icon, title, separation }}
      {#if (condition !== undefined && condition) || condition === undefined}
        <section on:click={fn}>
          <div class={RclickStyles.iconContainer}>
            <Icons icon={icon} size={23}/>
          </div>
          <p>{title}</p>
        </section>

        {#if separation}
          <section class={RclickStyles.separation}></section>
        {/if}
      {/if}        
    {/each}
  </div>
</div>


<style>
  .container {
    position: absolute;
    inset: 0;
    z-index: 998;
    background-color: rgba(0, 0, 0, .3);
    overflow: hidden;
  }

  #rClickMenu-fs {
    position: absolute;
    z-index: 999;
    background-color: var(--primaryColor);
    border: solid 1px var(--borderColor);
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
  }
</style>