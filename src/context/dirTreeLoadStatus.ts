import { writable } from 'svelte/store'

const enum Visibility {
  invisible = 'invisible',
  visible = 'visible'
}

const createContext = () => {
  const { subscribe, update } = writable<{
    visibleStatus: Visibility
    secondsEllapsed: number
    loadingDisks: string[]
    loading: boolean
    __interval: null | number,
    __tasks: Array<() => void>
  }>({
    visibleStatus: Visibility.invisible,
    secondsEllapsed: 0,
    loadingDisks: [],
    loading: true,
    __interval: null,
    __tasks: []
  })

  const handleStopInterval = () => {
    subscribe(state => {
      if(state.__interval) clearInterval(state.__interval)
    })()
  }

  const handleCloseProgressBar = () => update((prevState) => ({
    ...prevState,
    visibleStatus: Visibility.invisible,
  }))

  // show modal
  const showModal = () => update((prevState) => ({
    ...prevState,
    visibleStatus: Visibility.visible
  }))

  // toggle loading disks
  const removeLoadingDisk = (diskPath: string) => update((prevState) => {
    const newLoadingDisks = [...prevState.loadingDisks].filter(d => d !== diskPath)
    if (newLoadingDisks.length === 0) {
      handleStopInterval()
      setTimeout(handleCloseProgressBar, 3000);

      for (const task of prevState.__tasks) task()
    }

    return {
      ...prevState,
      loadingDisks: newLoadingDisks,
      loading: newLoadingDisks.length > 0,
      __tasks: newLoadingDisks.length > 0
        ? prevState.__tasks
        : []
    }
  })

  const addLoadingDisk = (diskPath: string) => update((prevState) => ({
    ...prevState,
    loadingDisks: [...prevState.loadingDisks].concat(diskPath),
    loading: true,
    __interval: prevState.__interval ?? setInterval(() => {
      update(prevState1 => ({
        ...prevState1,
        secondsEllapsed: prevState1.secondsEllapsed + .1
      }))
    }, 100)
  }))

  const waitUntilAvaliableDirTree = (task: () => void) => update(state => {
    if (!state.loading) {
      task()
      return state
    } else {
      return { ...state, __tasks: state.__tasks.concat(task) }
    }
  })

  return { 
    subscribe,
    waitUntilAvaliableDirTree,
    handleCloseProgressBar,
    showModal,
    addLoadingDisk,
    removeLoadingDisk 
  }
}

/**
 * Contains dirTreeLoadBar modal information
 * 
 * Loaded disks && related 
 */
export const DirTreeLoadContext = createContext()