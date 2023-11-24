<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang='ts'>
  import type { FileRowProps } from './directoryFilesProps';
  import tableStyles from './directoryFiles.module.css'
  import { useFormattedByteUnity } from '../../../hooks/useFormattedByteSize';
  import { FileCopyContext } from '../../../context/fileCopyContext';
  import { ShortcutKeysContext } from '../../../context/shortcutKey';
  import { getMaterialFileIcon, getMaterialFolderIcon } from 'file-extension-icon-js';
  import { RClickMenuContextFs } from '../../../context/rclickMenuFs';

  export let byte_size: FileRowProps['byte_size']
  export let is_file: FileRowProps['is_file']
  export let last_modified: FileRowProps['last_modified']
  export let name: FileRowProps['name']
  export let path: FileRowProps['path']
  export let isRowSelected: FileRowProps['isRowSelected']
 
  const changeSelectedFiles = () => {
    const ctrlPressed = $ShortcutKeysContext.keys.includes('control')
    FileCopyContext.updateFileSelection([path], ctrlPressed)
  }

  $: isSelected = () => {
    return isRowSelected
      ? tableStyles.trSelected 
      : ''
  }

  const fileDate = new Date(last_modified)
  const formattedYearDate = fileDate.toISOString().split('T').shift()
  const formattedHourDate = `${fileDate.getHours() < 10 ? '0' : ''}${fileDate.getHours()}`
  const formattedMinDate = `${fileDate.getMinutes() < 10 ? '0' : ''}${fileDate.getMinutes()}`
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
  class="{isSelected()} table-row"
  data-path={path}
>
  <td class={tableStyles.trName}>
    <div class={tableStyles.fileIcon}>
      <img src={fileExtImgSrc} alt={fileExtImgSrc}/>
    </div>
    {name}
  </td>
  <td>{is_file ? 'file' : 'folder'}</td>
  <td>{formattedByteUnity}</td>
  <td>{formattedYearDate} &nbsp; {formattedHourDate}:{formattedMinDate}</td>
</tr>


