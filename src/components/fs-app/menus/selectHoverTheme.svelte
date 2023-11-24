<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang="ts">
  export let changeThemeSelection: () => void
  export let mainHoverTheme: boolean

  const getPosition = (isMainTheme: boolean) => {
    return mainHoverTheme === isMainTheme
      ? 'top'
      : 'bottom'
  }
</script>

<div class="circle" on:contextmenu|preventDefault={changeThemeSelection}>
  <div class="half {getPosition(true)}" style="background-color: var(--hoverColor)"></div>
  <div class="half {getPosition(false)}" style="background-color: var(--secundaryHoverColor)"></div>
</div>

<style>
  .circle {
    width: 23px;
    height: 23px;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
  }
  .half {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 50%;
  }
  .top {
    clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%);
  }
  .bottom {
    clip-path: polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%);
  }
</style>