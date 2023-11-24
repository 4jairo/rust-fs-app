import { getDirContent } from '../tauriApi/invokeApi'
import { FileContext } from '../context/fileContext'
import { showErrorAlert } from '../alerts/alerts'

export const handleOpenFolder = async (dirName: string, newPath: string) => {
  try {
    const fileList = await getDirContent(newPath)

    FileContext.addDirToHistory({
      fileList,
      isDirectory: true,
      name: dirName,
      path: newPath
    })

  } catch (error) {
    await showErrorAlert(error as string)
  }
}