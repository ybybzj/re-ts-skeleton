export interface Dict {
  [key: string]: any
}

export interface ArrLike {
  [index: number]: any
  length: number
}

export type Indexable = Dict | ArrLike

// nullable
export type Nullable<T> = T | null | undefined

//option
export interface Some<T> {
  kind: 'Some'
  value: T
}

export interface None {
  kind: 'None'
}

export type Option<T> = Some<T> | None

export const None: None = {
  kind: 'None',
}

export function Some<T>(v: T): Some<T> {
  return {
    kind: 'Some',
    value: v,
  }
}

export function nullable_to_opt<T>(v: Nullable<T>): Option<T> {
  if (v == null) {
    return None
  } else {
    return Some<T>(v)
  }
}
