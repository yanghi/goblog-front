import React from 'react'

function useMounted(fn: Function) {
  const mounted = React.useRef(false)

  React.useEffect(() => {
    if (mounted.current) return
    mounted.current = true
    fn()
  }, [])
}

export { useMounted }
