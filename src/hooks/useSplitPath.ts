export function useSplitPath(path: string) {
  return path.split(/[\\/]/).filter(p => p)
}

export const arePathsEqual = (p1: string, p2: string) => {
  return useSplitPath(p1).join() === useSplitPath(p2).join()
}