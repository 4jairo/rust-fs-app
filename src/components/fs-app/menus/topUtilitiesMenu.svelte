<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang='ts'>
  import type { SubmitEv } from '../../common/eventListenerTypes';
  import topMenuStyles from '../../common/topMenu.module.css'
  import Icons from '../../common/icons.svelte';
  import { WindowLocationContext, WindowLocationTypes } from '../../../context/currentWindowContext';
  import { FileContext } from '../../../context/fileContext'; 
  import { DirTreeLoadContext, Visibility } from '../../../context/dirTreeLoadStatus'; 
  import { searchByName } from '../../../tauriApi/invokeApi';
  import { SearchParamsTopMenuFs } from '../../../context/searchParamsTopMenuFs';
  import { waitUntilAvaliableDirTreeNotification } from '../../../alerts/alerts';
  import { ContainerContext, FileCopyContext } from '../../../context/fileCopyContext';

  $: fileContext = $FileContext
  $: cantHistoryBack = fileContext.history.currentPath === 0
  $: cantHistoryForward = fileContext.history.currentPath === fileContext.history.paths.length -1
  $: filesExt = new Set(
    fileContext.fileList
      .filter(({ is_file }) => is_file)
      .map(({ name }) => name.split('.').pop() as string)
  )

  $: searchParamsContext = $SearchParamsTopMenuFs

  const handleSubmitSearch = async (event: SubmitEv<HTMLFormElement>) => {
    const currentPath = searchParamsContext.fromCurrentPath
    ? fileContext.history.paths[fileContext.history.currentPath].path
    : '' 

    const searchValue = event.currentTarget.input.value
    if(!searchValue) return

    const task = () => {
      SearchParamsTopMenuFs.updateLastSearchQuery(searchValue)

      searchByName(currentPath, searchValue, searchParamsContext.absoluteName)
      .then(fileList => {
        FileContext.addDirToHistory({
          fileList,
          isDirectory: false,
          path: currentPath,
          name: searchValue
        })
      })
    }

    if($DirTreeLoadContext.loading) {
      const { isConfirmed } = await waitUntilAvaliableDirTreeNotification();

      if(isConfirmed) task()
      else DirTreeLoadContext.waitUntilAvaliableDirTree(task)

      DirTreeLoadContext.setModalVisibility(Visibility.visible)
    } else {
      task()
    }
  }

  const updateContainerContext = () => {
    FileCopyContext.updateContainerContext(ContainerContext.TopUtilitiesMenu)
  }
</script>

<header class={topMenuStyles.container} on:click={updateContainerContext}>
  <section 
    on:click={() => WindowLocationContext.toggleCurrentWnidow()}
    class="{topMenuStyles.hovereable} {topMenuStyles.changeWindowContent}"
  >
    <div>
      <Icons icon={$WindowLocationContext === WindowLocationTypes.apps ? 'sw-right' : 'sw-left'}/>
    </div>
    <div>apps</div>
  </section>

  <section>
    <div 
      class="{cantHistoryBack ? topMenuStyles.notAvaliable : ''} {topMenuStyles.hovereable}"
      on:click={() => FileContext.handleChangeCurrentHistory('back')}
    >
      <Icons icon='larr' />
    </div>
    <div 
      class="{cantHistoryForward ? topMenuStyles.notAvaliable : ''} {topMenuStyles.hovereable}"
      on:click={() => FileContext.handleChangeCurrentHistory('forward')}
    >
      <Icons icon='rarr' />
    </div>
  </section>

  <section class='filesFilter'>
    <select
      id="fileExtFilter-fs"
      on:input={(e) => FileContext.updateFileExt(e.currentTarget.value)}
      bind:value={fileContext.filesExt}
    >
      <option value=''>All items</option>
      <option value='_FILES_'>Only Files</option>
      <option value='_FOLDERS_'>Only Folders</option>
      <option disabled></option>

      {#each Array.from(filesExt).sort() as ext}
        <option value={ext}>.{ext}</option>
      {/each}
    </select>
  </section> 

  <section class="{topMenuStyles.hovereable} inputContainer">
    <div>
      <input 
        id="filterQueryFilter-fs"
        type="text" placeholder="filter by name..."
        bind:value={searchParamsContext.filterQuery}
        on:input={(e) => SearchParamsTopMenuFs.updateFilterQuery(e.currentTarget.value)}
      />
    </div>
    <div>
      <button class="searchButton">
        <Icons icon='filter' size={27}/>
      </button>
    </div>
  </section> 

  <div class="searchContainer"> 
    <div class='toggleSearchParams'>
      <div>
        <label>
          <div><Icons icon='exact-name' size={20}/></div>
          <p>{searchParamsContext.absoluteName ? 'Only exact name' : 'Includes name'}</p>
          <input 
            hidden type='checkbox' name='absoluteMatch' 
            bind:checked={searchParamsContext.absoluteName}
            on:input={(e) => SearchParamsTopMenuFs.updateAbsoluteName(e.currentTarget.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          <div><Icons icon='folder-path' size={22}/></div>
          <p>{searchParamsContext.fromCurrentPath ? 'From this folder' : 'All disks'}</p>
          <input 
            hidden type='checkbox' name='absoluteMatch'
            bind:checked={searchParamsContext.fromCurrentPath}
            on:input={(e) => SearchParamsTopMenuFs.updateFromCurrentPath(e.currentTarget.checked)}
          />
        </label>
      </div>
    </div>

    <form class="inputContainer {topMenuStyles.hovereable}" on:submit|preventDefault={handleSubmitSearch}>
      <div>
        <input 
          type='text' name='input' placeholder='Search files...' 
          id="searchFilesInput-fs"
          bind:value={searchParamsContext.searchQuery}
          on:input={(e) => SearchParamsTopMenuFs.updateSearchQuery(e.currentTarget.value)}
        />
      </div>
  
      <div>
        <button class='searchButton'>
          {#if searchParamsContext.lastSearchQuery === searchParamsContext.searchQuery}
            <Icons icon='search' size={28} />
          {:else}
            <Icons icon='search-confirm' size={28} />
          {/if}
        </button>
      </div>
    </form>
  </div>
</header>

<style>
  .inputContainer {
    height: 85%;
    display: flex;
    align-items: center;
    gap: 5px
  }
  .inputContainer input {
    padding: 5px;
    margin: auto;
  }
  .inputContainer .searchButton {
    all: unset;
  }

  .searchContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px
  }

  .filesFilter {
    width: 30%;
  }
  .filesFilter > select {
    width: 100%;
  }
  select {
    font-size: 16px;
  }

  .toggleSearchParams {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .toggleSearchParams > div {
    border-bottom: solid 1px var(--borderColor);
    border-left: solid 1px var(--borderColor);
    border-right: solid 1px var(--borderColor);
    cursor: pointer;
    padding: 1px;
    border-radius: 3px;
    width: 150px;
    text-align: center;
  }
  .toggleSearchParams > div {
    position: relative;
  }
  .toggleSearchParams > div > label > p {
    padding-left: 25px;
  }
  .toggleSearchParams > div > label > div {
    position: absolute;
    left: 5px;
  }


  .toggleSearchParams > div:hover {
    background-color: var(--hoverColor)
  }
  @media (min-width: 1080px) {
    .searchContainer {
      height: 100%;
    }
    .toggleSearchParams {
      display: flex;
      flex-direction: row;
      gap: 10px;
      height: 100%
    }
    .toggleSearchParams > div {
      border: solid 1px var(--borderColor);
      height: 85%;
      display: flex;
      justify-content: center;
      align-items: center;  
    }
  }
</style>