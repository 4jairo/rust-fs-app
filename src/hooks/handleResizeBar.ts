import type { MouseEv } from "../components/common/eventListenerTypes"

type Bars = '--lateralBarWidth' | '--previsualizationWidth'
interface Props {
  clickEvent: MouseEv<HTMLDivElement>
  directionInverted: boolean
  barName: Bars
}

export const handleChangeBarWidth = (barName: Bars, newPercent: number) => {
  document.documentElement.style.setProperty(barName,`${newPercent.toFixed(0)}%`)
}

export const getBarWidth = (barName: Bars) => {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(barName)
  )
}

export const handleResizeBar = ({ clickEvent, directionInverted, barName }: Props) => {
  const prevPercentValue = getBarWidth(barName)
  
  const mouseMove = (moveEvent: MouseEvent) => {
    const distancePercent = (
      directionInverted
        ? clickEvent.clientX - moveEvent.clientX
        : moveEvent.clientX - clickEvent.clientX
    ) * 100 / window.innerWidth

    const newPercent = distancePercent + prevPercentValue

    if (newPercent < 65 && newPercent > 10) {
      document.documentElement.style.setProperty(barName,`${newPercent.toFixed(0)}%`)
    }
    //console.log(getComputedStyle(document.documentElement).getPropertyValue(barName))
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

