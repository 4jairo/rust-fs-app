<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<script lang="ts">
  import type { MouseEv } from "../../common/eventListenerTypes";
  import { handleResizeBar } from "../../../hooks/handleResizeBar";
  import { ContainerContext, FileCopyContext } from "../../../context/fileCopyContext"
  import { existentFile, getFileContent, getImgBlob } from "../../../tauriApi/invokeApi";
  import { PreVisualizationContext } from "../../../context/preVisualization";
  import hljs from 'highlight.js'
  import 'highlight.js/styles/atom-one-dark-reasonable.css'
 
  $: preVisContext = $PreVisualizationContext

  const updateContainerContext = () => {
    FileCopyContext.updateContainerContext(ContainerContext.PreVisualization)
  }

  const handleResize = (e: MouseEv<HTMLDivElement>) => {
    handleResizeBar({
      barName: '--previsualizationWidth',
      clickEvent: e,
      directionInverted: true
    })
  }

  let imageURL = ''
  let fileContent = { content: '', ok: true }
  $: currentPath = $FileCopyContext.selectedFilesPath[0]
  
  $: if (currentPath) { 
    (async () => {
      const existentPath = await existentFile(currentPath)
      if(existentPath.is_dir) return

      if(currentPath.endsWith('png')) {
        const result = await getImgBlob(currentPath)
        if(!result) return
        
        imageURL = URL.createObjectURL(
          new Blob([result.buffer], { type: 'image/png' })
        )

        return
      }

      const content = await getFileContent(currentPath)
      const fileExt = currentPath.split('.').pop()!
      try {
        const result = hljs.highlight(content, { language: fileExt }).value
        fileContent.content = result
        fileContent.ok = true
      } catch {
        fileContent.content = content
        fileContent.ok = false
      }
    })()
  }
</script>

<div class="container" on:click={updateContainerContext}>
  <div class="resizeBar" on:mousedown={handleResize}></div>

  <div class="content" id="preVisualizationContainer">  
    <!-- text -->
    {#if preVisContext.altZ}
      {#if fileContent.ok}
        {@html fileContent.content}
      {:else}
        <span>{fileContent.content}</span>
      {/if}
    {:else}
      {#if fileContent.ok}
        <pre>{@html fileContent.content}</pre>
      {:else}
        <span>{fileContent.content}</span>
      {/if}
    {/if}

    <!--img-->
    {#key imageURL}
      {#if imageURL}
        <img src={imageURL} alt={imageURL}/>
      {/if}
    {/key}
  </div>
</div>

<style>
  .container {
    background-color: var(--secundaryColor);
    width: var(--previsualizationWidth);
    height: var(--mainContentHeight);
    border-left: solid 1px var(--borderColor);
    position: relative;
    overflow: auto;
  }
  .content {
    padding-left: 8px;
    width: 100%;
  }
  .content > pre {
    margin: 0;
  }
  .content * {
    padding: 0;
    background-color: var(--secundaryColor) !important;
  }

  .resizeBar {
    padding: 2px;
    height: 100%;
    cursor: col-resize;
    position: absolute;
  }
</style>