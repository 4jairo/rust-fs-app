import type { MouseEv } from "../components/common/eventListenerTypes"
import { FileCopyContext } from "../context/fileCopyContext"

export const selectFilesBox = async (clickEv: MouseEv<HTMLDivElement>) => 
new Promise<string[]>((resolve) => {
  // select-box element
  const boxElement = document.getElementById('selectBox-fs') as HTMLDivElement

  // main content parent (viewport, scroll bar)
  const parentElmt = document.getElementById('mainContent-fs-parent') as HTMLDivElement
  parentElmt.clientTop

  // bottom && left coords
  const maxX = parentElmt.scrollWidth
  const maxY = parentElmt.scrollHeight

  const scrollBarWidth = parentElmt.offsetHeight - parentElmt.clientHeight
  const scrollBarHeight = parentElmt.offsetWidth - parentElmt.clientWidth

  // bottom && right viewport coords
  const {
    left: viewPortTopX,
    right: viewPortBottomX,
    top: viewPortTopY,
    bottom: viewPortBottomY
  } = parentElmt.getBoundingClientRect()

  const initialX = clickEv.clientX - parentElmt.offsetLeft + parentElmt.scrollLeft
  const initialY = clickEv.clientY - parentElmt.offsetTop + parentElmt.scrollTop
  setInitialPosition(boxElement, initialX, initialY)

  let currentX = 0
  let currentY = 0
  let selectedFiles: string[] = []

  const handleBoxMove = () => {
    const topX = Math.min(initialX, currentX + parentElmt.scrollLeft)
    const topY = Math.min(initialY, currentY + parentElmt.scrollTop)
    const bottomX = Math.max(initialX, currentX + parentElmt.scrollLeft)
    const bottomY = Math.max(initialY, currentY + parentElmt.scrollTop)

    boxElement.style.left = topX + 'px'
    boxElement.style.top = topY + 'px'
    boxElement.style.width = (bottomX - topX) + 'px'
    boxElement.style.height = (bottomY - topY) + 'px'

    {
      //absolute coords (table top left corner !== 0)
      const absoluteCurrentX = currentX + parentElmt.offsetLeft
      const absoluteCurrentY = currentY + parentElmt.offsetTop
  
      if(absoluteCurrentY - scrollBarHeight <= viewPortTopY) {
        parentElmt.scrollTop -= 2.5
      } else if(
        absoluteCurrentY + scrollBarHeight >= viewPortBottomY && 
        parentElmt.scrollTop + parentElmt.clientHeight < maxY
      ) {
        parentElmt.scrollTop += 2.5
      }
  
      if(absoluteCurrentX - scrollBarWidth <= viewPortTopX) {
        parentElmt.scrollLeft -= 2.5
      } else if(
        absoluteCurrentX + scrollBarWidth >= viewPortBottomX &&
        parentElmt.scrollLeft + parentElmt.clientWidth < maxX
      ) {
        parentElmt.scrollLeft += 2.5
      }
    }
    
    selectedFiles = handlePathSelection(
      bottomX + parentElmt.offsetLeft - parentElmt.scrollLeft, 
      bottomY + parentElmt.offsetTop - parentElmt.scrollTop,
      topY + parentElmt.offsetTop - parentElmt.scrollTop
    )
    FileCopyContext.updateTempFiles(selectedFiles)
  }

  const onMouseMove = (moveEv: MouseEvent) => {
    currentX = minMax(0, moveEv.clientX - parentElmt.offsetLeft, parentElmt.offsetWidth - scrollBarWidth)
    currentY = minMax(0, moveEv.clientY - parentElmt.offsetTop, parentElmt.offsetHeight - scrollBarHeight)

    handleBoxMove()
  }
  
  handleListeners({
    boxElement,
    scrollElement: parentElmt,
    onScroll: handleBoxMove,
    mouseMove: onMouseMove,
    resolve: () => {
      FileCopyContext.updateTempFiles([])
      resolve(selectedFiles)
    }
  })
})

function minMax(min: number, current: number, max: number) {
  if (current > max) return max
  if (current < min) return min
  return current
}

// function getNearCoord(a: number, current: number, b: number) {
//   const resultA = Math.abs(current - a)
//   const resultB = Math.abs(current - b)

//   return Math.min(resultA, resultB)
// }

function getAllPageRows() {
  return document.querySelectorAll<HTMLTableRowElement>('#mainContent-fs .table-row')
}

export function getCurrPagePaths() {
  return Array
    .from(getAllPageRows())
    .map(elmt => elmt.getAttribute('data-path') as string)
}

function handlePathSelection(bottomX: number, bottomY: number, topY: number) {
  const selectedPaths: string[] = []

  for (const rowItem of getAllPageRows()) {
    const rowFilePath = rowItem.getAttribute('data-path')!
    const { top, left, bottom } = rowItem.getBoundingClientRect()

    if(top <= bottomY && bottom >= topY && left <= bottomX) {
      selectedPaths.push(rowFilePath)
    }
  }

  return selectedPaths
}

// ctrl + ↑ ↓ key shortcuts auto scroll fn
export function handleAutoScroll(path: string) {
  const rowElement = Array.from(getAllPageRows()).find(
    (elmt) => elmt.getAttribute('data-path') === path
  )
  if(!rowElement) return

  const containerElmt = document.getElementById('mainContent-fs-parent') as HTMLDivElement

  const rowPosition = rowElement.offsetTop - containerElmt.offsetTop
  const centerDiff = (containerElmt.clientHeight - rowElement.clientHeight) / 3

  containerElmt.scrollTop = rowPosition - centerDiff
}


// select box
function setInitialPosition(el: HTMLDivElement, x: number, y: number) {
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.width = '0px'
  el.style.height = '0px'
  el.style.display = 'block'
}


interface ListenerProps {
  boxElement: HTMLDivElement,
  scrollElement: HTMLDivElement,
  mouseMove: (moveEv: MouseEvent) => void,
  onScroll: (scrollEv: Event) => void,
  resolve: () => void
}
function handleListeners({ boxElement, mouseMove, resolve, onScroll, scrollElement }: ListenerProps) {
  const onMouseUp = () => {
    boxElement.style.display = 'none'
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    scrollElement.removeEventListener('scroll', onScroll)
    resolve()
  }
  scrollElement.addEventListener('scroll', onScroll)
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', onMouseUp)
}