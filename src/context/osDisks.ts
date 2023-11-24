import { writable } from "svelte/store"
import type { getOsDisksType } from "../tauriApi/tauriApiTypes"

const createContext = () => {
  const { update, subscribe } = writable<{
    disks: getOsDisksType[]
  }>({
    disks: []
  })
  
  const addOsDisks = (disk: getOsDisksType | getOsDisksType[]) => {
    update(prevState => ({
      ...prevState,
      disks: prevState.disks.concat(disk)
    }))
  }

  const removeOsDisk = (diskPath: string) => {
    update(prevState => ({
      ...prevState,
      disks: prevState.disks.filter(d => d.disk_path !== diskPath)
    }))
  }

  return { subscribe, addOsDisks, removeOsDisk }
}


export const OsDisksContext = createContext()
