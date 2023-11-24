<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang="ts">
  import { getAutoComplete } from "../../../tauriApi/invokeApi";

  export let autoCompletePath: string
  export let hideMenu: () => void
  export let handleAddToPath: (path: string) => void
</script>

<div class="modalContainer" on:click={hideMenu}>
  <div class="autoCompleteContainer">
    {#await getAutoComplete(autoCompletePath) then values}
      {#each values as path}
        <p on:click={() => handleAddToPath(path)}>{path}</p>
      {/each}
    {/await}
  </div>
</div>


<style>
  .modalContainer {
    position: absolute;
    inset: 0;
  }

  .autoCompleteContainer {
    background-color: var(--secundaryColor);
    position: absolute;
    z-index: 1;
    top: calc(var(--utilitiesMenuHeight) + var(--pathMenuHeight));
    width: 70%;
    height: 50%;
    padding: 7px;
    overflow: auto;
  }
  .autoCompleteContainer > p {
    padding: 1px
  }
  .autoCompleteContainer > p:hover {
    background-color: var(--hoverColor);
  }
</style>