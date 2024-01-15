import { writable, get } from "svelte/store"
import type { getDirContentType } from "../tauriApi/tauriApiTypes"
import { SearchParamsTopMenuFs } from "./searchParamsTopMenuFs"
import { FileContext } from "./fileContext"

export const ITEMS_PER_PAGE = 50

const createPaginationContext = () => {
  const Store = writable({
    lastItemIndex: 0,
    canPrevPage: false,
    canNextPage: false,
    itemsList: [] as getDirContentType[]
  })

  const travelPagination = (pagesAmmount: number) => {
    Store.update((prevState) => {
      const { lastItemIndex, canPrevPage, canNextPage, itemsList } = prevState
      const newPagesAmmount = (pagesAmmount * ITEMS_PER_PAGE) + lastItemIndex
      if (
        (!canNextPage && newPagesAmmount >= lastItemIndex) ||
        (!canPrevPage && newPagesAmmount <= lastItemIndex)
      ) return prevState
  
      return {
        ...prevState,
        lastItemIndex: newPagesAmmount,
        canPrevPage: newPagesAmmount - ITEMS_PER_PAGE >= 0,
        canNextPage: newPagesAmmount + ITEMS_PER_PAGE <= itemsList.length
      } 
    })
  }

  const paginatedItemList = () => {
    const { lastItemIndex, itemsList } = get(Store)
    return itemsList.slice(lastItemIndex, lastItemIndex + ITEMS_PER_PAGE)    
  }

  const getFilteredItemList = () =>  {
    const { fileList, filesExt } = get(FileContext)
    const { filterQuery } = get(SearchParamsTopMenuFs)

    const filterQueryFn = ({ name }: getDirContentType) => {
      return name.includes(filterQuery)
    }

    //TODO: mvoe FilesExt prop to `SearchParamsTopMenuFs`
    switch (filesExt) {
      case '':
        return fileList.filter(filterQueryFn)

      case '_FILES_':
        return fileList.filter(({is_file}) => is_file).filter(filterQueryFn)

      case '_FOLDERS_':
        return fileList.filter(({is_file}) => !is_file).filter(filterQueryFn)
      
      default:
        return fileList.filter(
          ({is_file, name}) => is_file
            ? name.split('.').pop() === filesExt
            : false
        )
        .filter(filterQueryFn)
    }
  }

  const resetPagination = () => {
    const filteredItemList = getFilteredItemList()

    Store.update((prevState) => ({
      ...prevState, 
      lastItemIndex: 0,
      canPrevPage: false,
      itemsList: filteredItemList,
      canNextPage: filteredItemList.length > ITEMS_PER_PAGE,
    }))
  }

  return {
    subscribe: Store.subscribe,
    update: Store.update,
    resetPagination,
    travelPagination,
    paginatedItemList,
  }
}

export const PaginationContext = createPaginationContext()