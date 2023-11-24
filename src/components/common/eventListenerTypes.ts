export type MouseEv<T> = MouseEvent & {
  currentTarget: EventTarget & T
}

export type KeyboardEv<T> = KeyboardEvent & {
  currentTarget: EventTarget & T
}

export type SubmitEv<T> = SubmitEvent & {
  currentTarget: EventTarget & T
}

export type EventEv<T> = Event & { 
  currentTarget: EventTarget & T 
}

export type FocusEv<T> = FocusEvent & {
  currentTarget: EventTarget & T
}

