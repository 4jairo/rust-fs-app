import { pictureDir, downloadDir, desktopDir, documentDir, homeDir, videoDir, dataDir } from '@tauri-apps/api/path'

export const getConstantDirs = async () => {
  const [
    Home, 
    Desktop,
    Downloads, 
    Documents,
    Images,
    Videos,
    AppData
  ] = await Promise.all([
    homeDir(),
    desktopDir(),
    downloadDir(),
    documentDir(),
    pictureDir(),
    videoDir(),
    dataDir()
  ])

  return { Home, Desktop, Downloads, Documents, Images, Videos, AppData }
}