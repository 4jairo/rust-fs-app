import { writable } from "svelte/store"
import type { RClickCommomPropsFs } from "../components/fs-app/mainContent/directoryFilesProps"
import type { MouseEv } from "../components/common/eventListenerTypes"

const createRclickMenuContext = () => {
  const { subscribe, set: __set } = writable<RClickCommomPropsFs | null>(null) 

  const set = (ev: MouseEv<Element>, path: string, isFile: boolean) => {
    __set({
      x: ev.pageX,
      y: ev.pageY, 
      selectedPath: path, 
      isFile
    })
  }

  const hideMenu = () => __set(null)

  return { set, subscribe, hideMenu }
}

export const RClickMenuContextFs = createRclickMenuContext()
