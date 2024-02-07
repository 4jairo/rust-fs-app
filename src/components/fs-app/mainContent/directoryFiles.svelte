<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang='ts'>
  import type { MouseEv } from '../../common/eventListenerTypes'
  import DirectoryFileRow from './directoryFileRow.svelte'
  import tableStyle from './directoryFiles.module.css'
  import SearchFileRow from './searchFileRow.svelte'
  import { useSortedArrState } from '../../../hooks/useSortedArray'
  import { selectFilesBox } from '../../../hooks/setFilesBox'
  import { FileContext, type WindowFiltersPath } from '../../../context/fileContext'
  import { FileCopyContext } from '../../../context/fileCopyContext'
  import { ShortcutKeysContext } from '../../../context/shortcutKey'
  import { PaginationContext } from '../../../context/pagination';
  import { RClickMenuContextFs } from '../../../context/rclickMenuFs';
  import { SearchParamsTopMenuFs } from '../../../context/searchParamsTopMenuFs';
  const { sortByBooleans, sortByNumbers, sortByStrings } = useSortedArrState(FileContext.sortItemList)

  export let currPath: WindowFiltersPath

  $: pagination = $PaginationContext
  $: filterQuery = $SearchParamsTopMenuFs.filterQuery

  // selected && filtered files
  $: copyContext = $FileCopyContext

  $: isRowSelected = (path: string) => {
    return copyContext._tempSelectedFiles.includes(path) || copyContext.selectedFilesPath.includes(path)
  }


  // selectbox
  const handleSelectFiles = async (e: MouseEv<HTMLDivElement>) => {
    const ctrlPressed = $ShortcutKeysContext.keys.includes('control')
    if(!ctrlPressed) FileCopyContext.updateFileSelection([])

    const pathSelection = await selectFilesBox(e)
    FileCopyContext.updateFileSelection(pathSelection, ctrlPressed)
  }

  //table cols
  const tableColumns = [
    { title: 'Name', sortFn: () => sortByStrings('name') },
    { title: 'Type', sortFn: () => sortByBooleans('is_file') },
    { title: 'Size', sortFn: () => sortByNumbers('byte_size') },
    { title: 'Date', sortFn: () => sortByNumbers('last_modified') },
  ]
</script>

<div class={tableStyle.container} id='mainContent-fs'>
  <div class={tableStyle.selectBoxContainer} 
    on:mousedown={handleSelectFiles} 
    on:contextmenu|preventDefault|stopPropagation={(e) => RClickMenuContextFs.set(e, currPath.path, false)}
  ></div>

  {#if pagination.itemsList.length === 0}
    <div class="noFiles">
      <p>
        {currPath.isDirectory 
        ? `the folder on ( ${currPath.path} )`
        : `the search of ${currPath.name} ( ${currPath.path || 'all disks'} )`} doesn't have items
      </p>
    </div>
  
  {:else}
    <table class={tableStyle.fileTable}>
      <thead>
        <tr>
          {#each tableColumns as { sortFn, title }}
            <th on:dblclick={sortFn}>{title}</th>
          {/each}
        </tr>
      </thead>

      <tbody>
      {#key `${filterQuery} ${pagination.lastItemIndex}`}
        {#if currPath.isDirectory}
          {#each PaginationContext.paginatedItemList() as file}
            <DirectoryFileRow {...file}
              isRowSelected={isRowSelected(file.path)} 
            />
          {/each}
        {:else}
          {#each PaginationContext.paginatedItemList() as file}
            <SearchFileRow {...file}
              currentPath={currPath.path}
              isRowSelected={isRowSelected(file.path)}
            />  
          {/each}
        {/if}
      {/key}
      </tbody>
    </table>
  {/if}

  <!-- select box -->
  <div id="selectBox-fs" style="display: none;"></div>
</div>

<style>
  #selectBox-fs {
    position: absolute;
    z-index: 999;
    background-color: rgba(29, 129, 196, 0.295);
    border: solid 1px rgb(0, 71, 114);
    border-radius: 4px;
  }

  .noFiles {
    display: flex;
    justify-content: center;
  }

  .resizeIcon {
    cursor: col-resize;
    position: absolute;
    height: 20px; width: 20px;
    bottom: 0; right: 0;
  }
  .sortIcon {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>