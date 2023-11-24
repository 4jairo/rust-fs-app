//@ts-nocheck

export const useSortedArrState = (setSortedItems) => {
  const sortByStrings = (key: string) => {
    let result: boolean

    setSortedItems(prevState => {
      if(!prevState) return prevState
      if(typeof prevState[0][key] !== 'string') return prevState
      
      const condition = prevState[0][key] < prevState[prevState.length -1][key]
      result = condition

      return condition
        ? [...prevState.sort(({[key]: keyA}, {[key]: keyB}) => {
          if(keyA === keyB) return 0
          return keyA < keyB ? 1 : -1
        })]
        : [...prevState.sort(({[key]: keyA}, {[key]: keyB}) => {
          if(keyA === keyB) return 0
          return keyA < keyB ? -1 : 1
        })]
    })

    return result
  }

  const sortByBooleans = (key: string) => {
    let result: boolean

    setSortedItems(prevState => {
      if(!prevState) return prevState
      if(typeof prevState[0][key] !== 'boolean') return prevState

      const condition = prevState[0][key] === true 
      result = condition

      return condition
        ? [...prevState.sort(({[key]: keyA}, {[key]: keyB}) => {
          if(keyA === keyB) return 0
          return keyA ? 1 : -1
        })]
        : [...prevState.sort(({[key]: keyA}, {[key]: keyB}) => {
          if(keyA === keyB) return 0
          return keyA ? -1 : 1
        })]
    })

    return result
  }

  const sortByNumbers = (key: string) => {
    let reslut: boolean

    setSortedItems(prevState => {
      if(!prevState) return prevState
      if(typeof prevState[0][key] !== 'number') return prevState

      const condition = prevState[0][key] <= prevState[prevState.length -1][key]
      reslut = condition

      return condition
        ? [...prevState.sort(({[key]: keyA}, {[key]: keyB}) => keyB - keyA)]
        : [...prevState.sort(({[key]: keyA}, {[key]: keyB}) => keyA - keyB)]
    })

    return reslut
  }

  return {
    sortByBooleans,
    sortByNumbers,
    sortByStrings
  }
}