export function useLimitedArraySize<T>(arr: T[], newItems: T[], size: number) {

  if(newItems.length > size) {
    return newItems.splice(0, size)
  }

  const totalLength = arr.length + newItems.length
  if(totalLength > size) {
    const itemsToRemove = totalLength - size
    arr.splice(0, itemsToRemove)
  }
  
  return arr.concat(newItems)
}