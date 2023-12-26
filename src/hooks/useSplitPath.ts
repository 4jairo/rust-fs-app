export function useSplitPath(path: string) {
  const split1 = path.split('\\')
  const split2 = split1.map(p => p.split('/'))
  
  return split2.flat().filter(p => p !== '')
}

export const arePathsEqual = (p1: string, p2: string) => {
  const formattedPath1 = useSplitPath(p1).join()
  const formattedPath2 = useSplitPath(p2).join()
  
  return formattedPath1 === formattedPath2
}