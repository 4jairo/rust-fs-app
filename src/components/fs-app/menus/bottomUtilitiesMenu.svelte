<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<script lang='ts'>
  import Icons from '../../common/icons.svelte'
  import { FileContext } from '../../../context/fileContext';
  import { openTerminal } from '../../../tauriApi/invokeApi';
  import { ContainerContext, FileCopyContext } from '../../../context/fileCopyContext';
  import type { EventEv } from '../../common/eventListenerTypes';
  import SelectHoverTheme from './selectHoverTheme.svelte';
  import { PaginationContext } from '../../../context/pagination';
  import { getBarWidth, handleChangeBarWidth } from '../../../hooks/handleResizeBar';

  $: pagination = $PaginationContext

  $: fileContext = $FileContext
  $: currentPath = fileContext.history.paths[fileContext.history.currentPath].path

  $: fileExtFilteredInfo = () => {
    if(fileContext.filesExt === '') {
      return `${pagination.itemsList.length.toLocaleString()} filtered`
    }

    if(fileContext.filesExt === '_FILES_') {
      const filteredAmmount = pagination.itemsList.filter(({is_file}) => is_file).length.toLocaleString()
      return `(${filteredAmmount} files) filtered`
    }
    
    if(fileContext.filesExt === '_FOLDERS_') {
      const filteredAmmount = pagination.itemsList.filter(({is_file}) => !is_file).length.toLocaleString()
      return `(${filteredAmmount} folders) filtered`
    }

    // filtering by some specific ext
    const filteredAmmount = pagination.itemsList.filter(
      ({is_file, name}) => is_file
      ? name.split('.').pop() === fileContext.filesExt
      : false
    ).length.toLocaleString()
    return `(${filteredAmmount} .${fileContext.filesExt} files) filtered`
  }

  // seleced files
  $: fileCopyContext = $FileCopyContext
  $: selectedFiles = fileCopyContext.selectedFilesPath.length + fileCopyContext._tempSelectedFiles.length

  //theme
  let mainHoverTheme = true
  const handleChangeColorTheme = (event: EventEv<HTMLInputElement>) => {
    document.documentElement.style.setProperty(
      mainHoverTheme ? '--hoverColor' : '--secundaryHoverColor', 
      event.currentTarget.value
    )
  }

  const getCurrThemeColor = () => {
    return getComputedStyle(document.documentElement).getPropertyValue(
      mainHoverTheme ? '--hoverColor' : '--secundaryHoverColor'
    )
  }

  //files pre-visualization
  let visualization = getBarWidth('--previsualizationWidth') > 0
  const togglePreVisualization = () => {
    const isVisible = getBarWidth('--previsualizationWidth') > 0
    visualization = !isVisible

    if(isVisible) {
      handleChangeBarWidth('--previsualizationWidth', 0)
    } else {
      handleChangeBarWidth('--previsualizationWidth', 20)
    }
  }

  const updateContainerContext = () => {
    FileCopyContext.updateContainerContext(ContainerContext.Footer)
  }
</script>

<div class='container' on:click={updateContainerContext}>
  <section>
    <section on:click={() => openTerminal(currentPath)} style="cursor: pointer;" class="hovereable"> 
      <Icons icon='terminal' size={27}/>
      <p>Terminal</p>
    </section>

    <p class="separation">|</p>
    <section on:click={togglePreVisualization}>
      <Icons icon={visualization ? 'visualization-fill': 'visualization'} size={24}/>
    </section>

    <p class="separation">|</p>
    <section style="cursor: pointer;" class="">
      <label>
        {#key mainHoverTheme}
          <SelectHoverTheme changeThemeSelection={() => mainHoverTheme = !mainHoverTheme} {mainHoverTheme}/>
          <input type="color" class="changeThemeInput" value={getCurrThemeColor()} on:input={handleChangeColorTheme}/>
        {/key}
      </label>
    </section>
  </section>

  <section class="pageControlBtns">
    <button 
      class={pagination.canPrevPage ? '' : 'notAvaliable'} 
      on:click={() => PaginationContext.travelPagination(-1)}
    >
      <div><Icons icon='double-larr' size={20}/></div>
      <p>prev page</p>
    </button>
    <button
      class={pagination.canNextPage ? '' : 'notAvaliable'} 
      on:click={() => PaginationContext.travelPagination(1)}
    >
      <p>next page</p>
      <div><Icons icon='double-rarr' size={20}/></div>
    </button>
  </section>

  <section>
    <p>{fileContext.fileList.length.toLocaleString()} total</p>

    {#if pagination.itemsList.length !== fileContext.fileList.length}
      <p class="separation">|</p>
      <p>{fileExtFilteredInfo()}</p>
    {/if}

    {#if selectedFiles > 0}
      <p class="separation">|</p>
      <p>{selectedFiles} selected</p>
    {/if}
  </section>
</div>


<style>
  .container {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: var(--bottomMenuHeight);
    background-color: var(--secundaryColor);
    border-top: solid 1px var(--borderColor);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
  .container section, label {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
  }
  .container section {
    padding: 4px;
  }
  .container section > section {
    padding: 0
  }
  .separation {
    color: gray
  }

  .changeThemeInput {
    opacity: 0;
    height: 0;
    width: 0;
    padding: 0;
    margin: 0;
  }

  .pageControlBtns {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  .pageControlBtns > button {
    padding: 3px;
    width: 105px;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pageControlBtns > button > div {
    display: flex;
    align-items: center;
  }
  .notAvaliable {
    opacity: .2;
  }
  .hovereable:hover {
    background-color: var(--hoverColor);
    border-radius: 3px;
  }
</style>
