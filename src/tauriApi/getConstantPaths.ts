import { pictureDir, downloadDir, desktopDir, documentDir, homeDir, videoDir } from '@tauri-apps/api/path'

export const getConstantDirs = async () => {
  const [
    Home, 
    Desktop,
    Downloads, 
    Documents,
    Images,
    Videos
  ] = await Promise.all([
    homeDir(),
    desktopDir(),
    downloadDir(),
    documentDir(),
    pictureDir(),
    videoDir()
  ])

  return { Home, Desktop, Downloads, Documents, Images, Videos }
}