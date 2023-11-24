import { writable } from "svelte/store"

const createPrevisualizationContext = () => {
  const State = writable({
    altZ: false
  })

  return State  
}

export const PreVisualizationContext = createPrevisualizationContext()