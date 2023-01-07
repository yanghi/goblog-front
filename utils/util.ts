import type React from 'react'

export function dispatchValue<S>(value: React.SetStateAction<S>, prev: S): S {
  return typeof value == 'function' ? (value as any)(prev) : value
}

export const isObject = (obj: unknown) => obj && typeof obj === 'object'

export const isArray = Array.isArray

export const hasProp = (obj: Record<any, any>, key: string) => obj && key in obj

export const getObjectValue = <D, R = any>(
  fnOrDotKey: ((data: D) => R | undefined) | string,
  data: D
): R | undefined => {
  if (!isObject(data)) return void 0

  if (typeof fnOrDotKey == 'function') return fnOrDotKey(data)

  return getProp(data, fnOrDotKey)
}

export function getProp<T = Record<any, any>>(obj: T, prop: string | Array<keyof T>) {
  let keys = typeof prop == 'string' ? prop.split('.') : prop
  let cur: any = obj
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!isObject(cur) || !hasOwnProp(cur, key as string)) return undefined
    cur = cur[key as string]
  }
  return cur
}
export const hasOwnProp = (obj: any, prop: string) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
export const noop = () => { }