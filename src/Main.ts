type Nullable<T> = T | null | undefined

interface Some<T> {
  kind: 'Some'
  value: T
}

interface None {
  kind: 'None'
}

type Option<T> = Some<T> | None

const None: None = {
  kind: 'None',
}

function Some<T>(v: T): Some<T> {
  return {
    kind: 'Some',
    value: v,
  }
}

function to_opt<T>(v: Nullable<T>): Option<T> {
  if (v == null) {
    return None
  } else {
    return Some(v)
  }
}

function nullableToStr<T>(v: Nullable<T>): string {
  const opt_v = to_opt(v)
  switch (opt_v.kind) {
    case 'Some':
      return `Some(${opt_v.value})`
    case 'None':
      return 'None'
  }
}

console.log(nullableToStr<string>(null))
console.log(nullableToStr<string>('asda'))
console.log(nullableToStr<number>(null))
console.log(nullableToStr<number>(12))
