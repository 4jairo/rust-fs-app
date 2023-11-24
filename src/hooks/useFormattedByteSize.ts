export function useFormattedByteUnity(num: number) {
  const units = ['B', 'KB', 'MB', 'GB']

  let unitIndex = 0
  while (num >= 1000 && unitIndex < units.length) {
    num /= 1000
    unitIndex++
  }

  const unit = units[unitIndex] ?? 'TB'

  return `${num.toFixed(2)} ${unit}`
}