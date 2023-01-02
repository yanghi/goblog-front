import Cookie from 'js-cookie'

export const setToken = (token?: string) => {
  if (token) {
    Cookie.set('token', token, { expires: 1000 })
  } else {
    Cookie.remove('token')
  }
}

export function getToken() {
  return Cookie.get('token')
}