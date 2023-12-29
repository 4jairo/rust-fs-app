import { writable } from "svelte/store"
import type { getOsDisksType2 } from "../tauriApi/tauriApiTypes"

const createContext = () => {
  const { update, subscribe } = writable<{
    disks: getOsDisksType2[]
  }>({
    disks: []
  })
  
  const addOsDisk = (disk: getOsDisksType2) => {
    update(prevState => ({
      ...prevState,
      disks: [...prevState.disks, disk]
    }))
  }

  const removeOsDisk = (diskPath: string) => {
    update(prevState => ({
      ...prevState,
      disks: prevState.disks.filter(([path]) => path !== diskPath)
    }))
  }

  return { subscribe, addOsDisk, removeOsDisk }
}


export const OsDisksContext = createContext()
