import type { getDirContentType } from '../../../tauriApi/tauriApiTypes'
import type { IconType } from '../../common/icons';

//! R CLICK
export interface RClickCommomPropsFs {
  x: number
  y: number
  selectedPath: string
  isFile: boolean
}

export interface FileRowProps extends getDirContentType {
  addRClickMenu: (props: RClickCommomPropsFs) => void
  isRowSelected: boolean
}

export interface FileRowSearchProps extends FileRowProps {
  currentPath: string // -> path from where the search was done
}

export interface RCLickOptionsType { 
  title: string
  icon: IconType
  fn: () => void
  condition?: boolean
  separation?: true
}

//! SELECT BOX
export interface SelectBoxPropsFs {
  x1: number
  y1: number
  x2: number
  y2: number
}