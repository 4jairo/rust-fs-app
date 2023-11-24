import { readable } from 'svelte/store'

export const createCounter = () => {
  let interval: number

  const { subscribe } = readable(0, (_, update) => {
    interval = setInterval(() => {
      update(n => n += .1)
    }, 100)

    return () => clearInterval(interval)
  })

  const stopInterval = () => {
    clearInterval(interval)
  }

  return { subscribe, stopInterval }
}

export const getTimingCentSecs = (operation: () => Promise<void>, centSecsCb: (i: number) => void) => {
  let i = 0
  const interval = setInterval(() => {
    i += .1
    centSecsCb(i)
  }, 100)

  operation().then(() => clearInterval(interval))
}