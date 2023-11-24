import { writable } from "svelte/store"

function createContext() {
  const { subscribe, update } = writable<{
    keys: string[]
  }>({
    keys: []
  })

  const addKey = (key: string) => update(({ keys }) => ({
    keys: keys.includes(key)
      ? keys
      : [...keys, key]
  }))

  const removeKey = (key: string) => update(({ keys }) => ({
    keys: keys.includes(key)
      ? keys.filter(k => k !== key)
      : keys
  }))

  return { subscribe, addKey, removeKey }
}

export const ShortcutKeysContext = createContext()
