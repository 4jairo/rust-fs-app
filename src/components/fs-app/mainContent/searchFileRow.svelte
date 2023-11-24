<script lang='ts'>
  import type { FileRowSearchProps } from './directoryFilesProps'
  import tableStyles from './directoryFiles.module.css'
  import { useFormattedByteUnity } from '../../../hooks/useFormattedByteSize'
  import { FileCopyContext } from '../../../context/fileCopyContext'
  import { ShortcutKeysContext } from '../../../context/shortcutKey'
  import { getMaterialFileIcon, getMaterialFolderIcon } from 'file-extension-icon-js'
  import { useSplitPath } from '../../../hooks/useSplitPath'
  import { SearchParamsTopMenuFs } from '../../../context/searchParamsTopMenuFs'
  import Icons from '../../common/icons.svelte'
  import SplitInclusive from '../../../hooks/splitInclusive.svelte'
  import { RClickMenuContextFs } from '../../../context/rclickMenuFs'

  export let byte_size: FileRowSearchProps['byte_size']
  export let is_file: FileRowSearchProps['is_file']
  export let last_modified: FileRowSearchProps['last_modified']
  export let name: FileRowSearchProps['name']
  export let path: FileRowSearchProps['path']
  export let isRowSelected: FileRowSearchProps['isRowSelected']
  export let currentPath: FileRowSearchProps['currentPath'] 
  
  const changeSelectedFiles = () => {
    const ctrlPressed = $ShortcutKeysContext. keys.includes('control')
    FileCopyContext.updateFileSelection([path], ctrlPressed)
  }

  const searchParamsScreenshot = $SearchParamsTopMenuFs

  const fileDate = new Date(last_modified)
  const formattedYearDate = fileDate.toISOString().split('T').shift()
  const formattedHourDate = `${fileDate.getHours() < 10 ? '0' : ''}${fileDate.getHours()}`
  const formattedMinDate = `${fileDate.getMinutes() < 10 ? '0' : ''}${fileDate.getMinutes()}`

  const newFilePath = currentPath.length > 0
    ? path.split(useSplitPath(currentPath).join('\\')).pop()!
    : path
  const fileExtImgSrc = is_file
    ? getMaterialFileIcon(name)
    : getMaterialFolderIcon(name)
  const formattedByteUnity = is_file
    ? useFormattedByteUnity(byte_size)
    : ''
</script>

<tr
  on:click={changeSelectedFiles}
  on:dblclick={() => FileCopyContext.handleOpenFile(is_file, path, name)}
  on:contextmenu|preventDefault|stopPropagation={(e) => RClickMenuContextFs.set(e, path, is_file)} 
  class="{isRowSelected ? tableStyles.trSelected : ''} table-row"
  data-path={path}
>
  <td class={tableStyles.trNameSearch}>
    <div>
      <div class={tableStyles.fileIcon}>
        <img src={fileExtImgSrc} alt={fileExtImgSrc}/>
      </div>
      <div>
        {#if !searchParamsScreenshot.absoluteName}
          <SplitInclusive txt={name} splitter={searchParamsScreenshot.lastSearchQuery}/>
        {:else}
          <span>{name}</span>
        {/if}
      </div>
    </div>
    <div>
      <div class={tableStyles.searchFileLocation}>
        {#if searchParamsScreenshot.fromCurrentPath}
          <Icons icon='search' size={16}/>
          {
            newFilePath.startsWith('\\')
            ? newFilePath
            : `\\${newFilePath}`
          }
        {:else}
          {newFilePath}
        {/if}
      </div>
    </div>
  </td>
  <td>{is_file ? 'file' : 'folder'}</td>
  <td>{formattedByteUnity}</td>
  <td>{formattedYearDate} &nbsp; {formattedHourDate}:{formattedMinDate}</td>
</tr>
