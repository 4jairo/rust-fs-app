import { writable } from 'svelte/store'

export const enum WindowLocationTypes {
  fs,
  apps
}

const createWindowContextContext = () => {
  const { subscribe, update } = writable(WindowLocationTypes.fs)

  const toggleCurrentWnidow = () => {
    update(prevValue => prevValue === WindowLocationTypes.fs 
      ? WindowLocationTypes.apps
      : WindowLocationTypes.fs
    )
  }

  return { subscribe, toggleCurrentWnidow }
}


/**
 * fs window || application window 
 */
export const WindowLocationContext = createWindowContextContext()