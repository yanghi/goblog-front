import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { store } from '../store'
import { Provider } from 'react-redux'
import Router from 'next/router'
import { useEffect } from 'react'
import { getToken } from '../utils/cookies'
import { getUserInfo } from '../store/user/userActionCreators'
import { useMounted } from '../hooks/useMouted'

function checkLogin() {
  console.log('Checking')
  if (process.browser && !store.getState().user.logged && getToken()) {
    store.dispatch(getUserInfo())
  }
}
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Router.events.on('routeChangeStart', checkLogin)

    return () => {
      Router.events.off('routeChangeStart', checkLogin)
    }

  }, [])
  useMounted(checkLogin)

  return <Provider store={store}><Component {...pageProps} /></Provider>
}
