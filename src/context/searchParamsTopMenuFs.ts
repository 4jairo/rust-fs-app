import { writable } from "svelte/store"
import { PaginationContext } from "./pagination"

const createContext = () => {
  const { update, subscribe } = writable({
    absoluteName: false,
    fromCurrentPath: true,
    caseSensitive: true,
    filterQuery: '',
    searchQuery: '',
    lastSearchQuery: '',
  })

  const updateAbsoluteName = (newValue?: boolean) => update(prev => ({
    ...prev, absoluteName: newValue ?? !prev.absoluteName 
  }))

  const updateCaseSensitive = (newValue?: boolean) => update(prev => ({
    ...prev, caseSensitive: newValue ?? !prev.caseSensitive 
  }))

  const updateFromCurrentPath = (newValue?: boolean) => update(prev => ({
    ...prev, fromCurrentPath: newValue ?? !prev.fromCurrentPath
  }))

  const updateSearchQuery = (newValue: string) => update(prev => ({
    ...prev, searchQuery: newValue
  }))

  const updateLastSearchQuery = (newValue: string) => update(prev => ({
    ...prev, lastSearchQuery: newValue
  }))

  const updateFilterQuery = (newValue: string) => {
    PaginationContext.resetPagination()

    update(prev => ({
      ...prev, filterQuery: newValue
    }))
  }
  
  return {
    updateAbsoluteName,
    updateFilterQuery,
    updateFromCurrentPath,
    updateLastSearchQuery,
    updateSearchQuery,
    updateCaseSensitive,
    subscribe
  } 
}

export const SearchParamsTopMenuFs = createContext()