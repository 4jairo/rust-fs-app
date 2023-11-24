import { writable } from 'svelte/store'
import type { getAllApps } from '../tauriApi/tauriApiTypes'


const createContext = () => {
  const { subscribe, set } = writable<{
    appList: getAllApps
  }>({ 
    appList: {} 
  })

  const setAppList = (appList: getAllApps) => set({ appList })

  return { subscribe, setAppList }
}

/**
 * Application List
 */
export const AppsContext = createContext()