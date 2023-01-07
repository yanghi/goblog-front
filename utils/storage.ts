import { User } from "../struct/user"
import { runInBrowserWrap } from "./runtime"

export const getLocalUser = runInBrowserWrap((): User | undefined => {
  let r = window.localStorage.getItem('usr')
  if (r) {
    return JSON.parse(r)
  }
})

export const setLocalUser = runInBrowserWrap((user: User) => window.localStorage.setItem('usr', JSON.stringify(user)))