<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<script lang="ts">
  import type { MouseEv } from "../../common/eventListenerTypes";
  import { handleResizeBar } from "../../../hooks/handleResizeBar";
  import { ContainerContext, FileCopyContext } from "../../../context/fileCopyContext"
  import { existentFile, getFileContent, getImgBlob } from "../../../tauriApi/invokeApi";
  import { PreVisualizationContext } from "../../../context/preVisualization";
  import hljs from 'highlight.js'
  import { isImage } from "../../../context/isImage";
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

  let fileContent = { content: '', ok: true, isImage: false }
  $: currentPath = $FileCopyContext.selectedFilesPath[0]
  
  $: if (currentPath) {
    (async () => {
      const existentPath = await existentFile(currentPath)
      if(existentPath.is_dir) return

      const fileExt = currentPath.split('.').pop()!

      if(isImage(fileExt) && fileExt !== 'svg') {
        // is image
        try {
          const result = await getImgBlob(currentPath)
          if(!result) throw null

          const binaryString = String.fromCharCode(...result)
          const base64Img = `data:image/${fileExt};base64,${btoa(binaryString)}`

          const img = new Image()
          img.onerror = () => {
            fileContent.isImage = false
            fileContent.content = "can't get image"
          }
          img.onload = () => {
            fileContent.isImage = true
            fileContent.content = base64Img
          }
          img.src = base64Img

        } catch {
          fileContent.isImage = false
          fileContent.content = "can't get image"
        }

        return
      }

      // plain txt
      const content = await getFileContent(currentPath)
      fileContent.isImage = false
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
    {#if fileContent.isImage}
      <!-- image -->
      <img src={fileContent.content} alt={currentPath}/>

    {:else}
      <!-- text -->
      {#if preVisContext.altZ}
        {#if fileContent.ok}
          <p>{@html fileContent.content}</p>
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
    {/if}
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
  .content img {
    width: 100%;
    height: 100%;
  }

  .resizeBar {
    padding: 2px;
    height: 100%;
    cursor: col-resize;
    position: absolute;
  }
</style>