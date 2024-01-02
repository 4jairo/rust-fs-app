const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

export function useFormattedByteUnity(num: number) {
  let unitIndex = 0
  while (num >= 1000 && unitIndex < units.length) {
    num /= 1000
    unitIndex++
  }

  const unit = units[unitIndex]
  return `${num.toFixed(2)} ${unit}`
}

export function getBytes(value: string) {
  const [num, unit] = value.split(' ')
  
  const parsedUnit = unit.toUpperCase()
  const unitsDiff = units.findIndex(u => u === parsedUnit)
  
  let parsedNum = parseFloat(num)
  if(unitsDiff === -1) return 0
  for (let i = 0; i < unitsDiff; i++) {
    parsedNum *= 1000
  }

  return parsedNum
}
