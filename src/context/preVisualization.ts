import { writable } from "svelte/store"

const createPrevisualizationContext = () => {
  const State = writable({
    altZ: false,
    visible: false
  })

  const toggleAltZ = () => {
    State.update(prev => ({
      ...prev, altZ: !prev.altZ
    }))
  } 

  const setVisibility = (visible: boolean) => {
    State.update(prev => ({
      ...prev, visible
    }))
  }  

  return {
    subscribe: State.subscribe,
    toggleAltZ,
    setVisibility
  }
}

export const PreVisualizationContext = createPrevisualizationContext()