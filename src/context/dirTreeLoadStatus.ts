import { writable } from 'svelte/store'

export const enum Visibility {
  invisible = 'invisible',
  visible = 'visible'
}

const createContext = () => {
  const State = writable<{
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
 
  const handleStartInterval = () => {
    State.update(prevState1 => ({
      ...prevState1,
      secondsEllapsed: prevState1.secondsEllapsed + .1
    }))
  }

  const setModalVisibility = (visibleStatus: Visibility) => {
    State.update((prevState) => ({
      ...prevState, visibleStatus
    }))
  }

  const addLoadingDisk = (diskPath: string) => {
    State.update(prevState => ({
      ...prevState,
      loadingDisks: [...prevState.loadingDisks].concat(diskPath),
      loading: true,
      __interval: prevState.__interval ?? setInterval(handleStartInterval, 100)
    }))
  }
  
  const removeLoadingDisk = (diskPath: string) => {
    State.update(prevState => {
      const newLoadingDisks = [...prevState.loadingDisks].filter(d => d !== diskPath)

      if (newLoadingDisks.length === 0) {   
        if(prevState.__interval) clearInterval(prevState.__interval)
        
        setTimeout(() => setModalVisibility(Visibility.invisible), 3000)
        for (const task of prevState.__tasks) task()
      }

      return {
        ...prevState,
        loadingDisks: newLoadingDisks,
        loading: newLoadingDisks.length > 0,
        __tasks: newLoadingDisks.length > 0
          ? prevState.__tasks
          : [],
        __interval: newLoadingDisks.length > 0
          ? prevState.__interval
          : null
      }
    })
  }
  
  const waitUntilAvaliableDirTree = (task: () => void) => {
    State.update(state => {
      if (!state.loading) {
        task()
        return state
      }
      
      return { 
        ...state, __tasks: state.__tasks.concat(task) 
      }
    })
  }
  
  return { 
    subscribe: State.subscribe,
    waitUntilAvaliableDirTree,
    setModalVisibility,
    removeLoadingDisk,
    addLoadingDisk
  }
}

export const DirTreeLoadContext = createContext()