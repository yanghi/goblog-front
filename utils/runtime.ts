import { noop } from "./util"

export const runInBrowser = <T extends ((...args: any) => any)>(fn: T): undefined | ReturnType<T> => {
  if (process.browser) {
    return fn()
  }
}

export const runInBrowserWrap = <T extends ((...args: any) => any)>(fn: T): T => {
  if (process.browser) {
    return fn
  }
  return noop as T
}