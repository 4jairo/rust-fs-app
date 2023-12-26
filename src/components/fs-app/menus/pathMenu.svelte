<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang='ts'>
  import type { EventEv } from '../../common/eventListenerTypes';
  import Icons from '../../common/icons.svelte'
  import AutoCompletePathMenu from './autoCompletePathMenu.svelte';
  import { join } from '@tauri-apps/api/path'
  import { FileContext } from '../../../context/fileContext'
  import { useSplitPath } from '../../../hooks/useSplitPath'
  import { showErrorAlert } from '../../../alerts/alerts'
  import { getCurrPagePaths } from '../../../hooks/setFilesBox'
  import { ContainerContext, FileCopyContext } from '../../../context/fileCopyContext'
  import { ShortcutKeysContext } from '../../../context/shortcutKey'
  import { SearchParamsTopMenuFs } from '../../../context/searchParamsTopMenuFs'
  import { existentFile, getDirContent, getPathParent, openFile, searchByName } from '../../../tauriApi/invokeApi'
  import { PaginationContext } from '../../../context/pagination';
  
  let pathInputShape = false
  $: windowHistory = $FileContext.history
  $: currentPath = windowHistory.paths[windowHistory.currentPath]
  $: selectedFiles = $FileCopyContext.selectedFilesPath
  $: lastItemIndexPagination = $PaginationContext.lastItemIndex

  $: areAllPagesSelected = () => {
    if ($FileContext.fileList.length === 0) return false 

    for (const { path } of $FileContext.fileList) {
      if(!selectedFiles.includes(path)) {
        return false
      }
    }
    return true
  }

  $: isCurrentPageSelected = () => {
    if (selectedFiles.length === 0) return false

    for (const path of getCurrPagePaths()) {
      if(!selectedFiles.includes(path)) {
        return false
      }
    }
    return true
  }

  const handleTravelToPath = async (index: number, name: string) => {
    try {
      if(!currentPath.isDirectory) return

      const newPath = await join(
        ...useSplitPath(currentPath.path).slice(0, index +1)
      )

      FileContext.addDirToHistory({
        isDirectory: currentPath.isDirectory,
        name,
        path: newPath,
        fileList: await getDirContent(newPath),
      })
    } catch (error) {
      await showErrorAlert(error as string)
    }
  }

  const handleSubmit = async (newPath: string) => {
    const fileSearch = await existentFile(newPath)

    if(fileSearch.is_dir) {
      if(currentPath.path !== newPath) return

      return FileContext.addDirToHistory({
        isDirectory: currentPath.isDirectory,
        name: useSplitPath(newPath).pop() as string,
        path: newPath,
        fileList: currentPath.isDirectory
          ? await getDirContent(newPath)
          : await searchByName(newPath, currentPath.name, $SearchParamsTopMenuFs.absoluteName)
      })
    }

    else if(fileSearch.is_file) {
      return await openFile(newPath)
    }

    await showErrorAlert(`<b>${newPath}</b> is not a valid folder path`)
  }

  const handleButtonSumit = async () => {
    const inputValue = document.getElementById('input-pathMenu-fs') as HTMLInputElement
    await handleSubmit(inputValue.value)
  }

  const handleSelectFiles = (currentPage: boolean) => {
    const selectionPaths = currentPage
      ? getCurrPagePaths()
      : $FileContext.fileList.map(({ path }) => path)

    const ctrlPressed = $ShortcutKeysContext. keys.includes('control')
    FileCopyContext.updateFileSelection(selectionPaths, ctrlPressed)
  }

  // autocomplete path
  $: autoComplete = {
    visible: false,
    path: currentPath.path
  }

  const handleAddToPath = (path: string) => {
    const searchInput = document.getElementById('input-pathMenu-fs') as HTMLInputElement
    searchInput.value.endsWith('/') || searchInput.value.endsWith('\\')
      ? searchInput.value += path
      : searchInput.value += `\\${path}`

    searchInput.focus()
  }

  const handleChangeSearchMode = async () => {
    const fileList = await getDirContent(currentPath.path)

    FileContext.addDirToHistory({
      isDirectory: true,
      name: useSplitPath(currentPath.path).pop()!,
      path: currentPath.path,
      fileList
    })
  }

  const handeUpdateAutoComplete = async (event: EventEv<HTMLInputElement>) => {
    //@ts-ignore
    const currentValue: string = event.target.value
    const existsPath = await existentFile(currentValue)

    if (existsPath.is_dir) {
      autoComplete.path = currentValue
    }
    else if(existsPath.is_file) {
      const parent = await getPathParent(currentValue)
      if(parent) autoComplete.path = parent
    }
  }
  
  const updateContainerContext = () => {
    FileCopyContext.updateContainerContext(ContainerContext.PathMenu)
  }

  $: pathNames = currentPath.isDirectory
    ? useSplitPath(currentPath.path)
    : [`${currentPath.name} (${currentPath.path})`]
</script>

<div class='container' on:click={updateContainerContext}>
  <!-- search path input -->
  {#if pathInputShape}
    <form class="searchPath maxContentWidth" 
      on:submit|preventDefault={(e) => handleSubmit(e.currentTarget.inputValue.value)}
    >
      <input 
        id="input-pathMenu-fs"
        name="inputValue"
        autocomplete="off"
        value={currentPath.path}
        on:input={handeUpdateAutoComplete}
        on:focus={() => autoComplete.visible = true}
      />

      {#if autoComplete.visible}
        <AutoCompletePathMenu {handleAddToPath}
          autoCompletePath={autoComplete.path} 
          hideMenu={() => autoComplete.visible = false}
        />
      {/if}
    </form>

  {:else} 
    <div class="currentPath maxContentWidth">
      {#each pathNames as name, index}
        <span class="pathContent {currentPath.isDirectory ? 'hovereable' : ''}" on:click={() => handleTravelToPath(index, name)}>
          {#if !currentPath.isDirectory}
            <Icons icon='search' size={15}/>
          {/if}
          {name}
        </span>

        {#if pathNames.length -1 !== index}
          <span>&gt;</span>
        {/if}
      {/each}
    </div>
  {/if}

  <!-- right icons -->
  <div class="rightIcon">
    {#if pathInputShape}
      <div class="hovereable" on:click={handleButtonSumit}>
        <Icons icon='search' size={25}/>
      </div>
    {/if}
  
    <div class="hovereable" on:click={() => pathInputShape = !pathInputShape} title="edit current path">
      <Icons icon='edit' size={25}/>
    </div>

    {#if !currentPath.isDirectory}
      <div class="hovereable" on:click={handleChangeSearchMode} title="change search mode (on current path)">
        <Icons icon='search-off' size={25}/>
      </div>
    {/if}
  
    {#key currentPath.path}  
      {#key lastItemIndexPagination}  
        <div class="hovereable" on:click={() => handleSelectFiles(true)} title="select current page">
          <Icons icon={isCurrentPageSelected() ? 'select-fill' : 'select'} size={25}/>
        </div>
      {/key}
    
      <div class="hovereable" on:click={() => handleSelectFiles(false)} title="select all pages">
        <Icons icon={areAllPagesSelected() ? 'selectAll-fill' : 'selectAll'} size={24}/>
      </div>
    {/key}
  </div>
</div>

<style>
  .container {
    height: var(--pathMenuHeight);
    background-color: var(--secundaryColor);
    border-bottom: var(--borderColor) 1px solid;
    display: flex;
    padding: 0 10px;
  }
  .currentPath {
    display: flex;
    overflow: auto;
  }
  .currentPath > span {
    padding: 0 4px;
    height: fit-content;
    margin: auto 0;
    color: rgb(201, 201, 201)
  }
  .currentPath::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .pathContent {
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .rightIcon {
    all: unset;
    display: flex;
    height: 100%;
    padding: 0 5px;
    border-radius: 3px;
  }
  .rightIcon > * {
    padding: 0 4px;
  }
  .rightIcon *:not(input) {
    display: flex;
    align-items: center;
  }
  .maxContentWidth {
    height: 100%;
    width: 100%;
  }
  .searchPath > input {
    all: unset;
    height: 100%;
    width: 100%;
    letter-spacing: .5px;
  }
  .hovereable:hover {
    background-color: var(--hoverColor);
    cursor: pointer;
  }
</style>