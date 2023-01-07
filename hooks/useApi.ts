import { useLatest, useSetState } from "ahooks"
import { AxiosResponse } from "axios"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { ApiResponse } from "../struct/response"
import { dispatchValue, hasProp, isArray, isObject } from "../utils/util"

type ApiAction = (...args: any[]) => Promise<any>

export interface UseApiOptions<T extends any[], R, D> {
  /**
   * 默认false,是否立即请求
   */
  immediately?: boolean
  onError?: (e: any) => void
  /**
   * 无论失败或成功都调用, 无error参数时为成功
   */
  onFinished?: (res: R, error: any | undefined) => void
  /**
   * default: true
   */
  auto?: boolean
  initialData?: (() => D) | D
  /**
   * 请求函数参数数组
   */
  params?: T
  onEffectFetch?: (deps: any[]) => void
}

export const useApi = <T extends ApiAction, R extends PromiseValue<T>, D extends ApiData<R>>(
  action: T,
  options: UseApiOptions<Parameters<T>, R, D> = {}
) => {
  const { immediately, onError, onFinished, auto = true, initialData, onEffectFetch } = options
  const [record, setRecord] = useSetState<{
    state: FetchState
    /**
     * 是否成功过(非最后一次请求)
     */
    hasBeenSuccess: boolean
    /**
     * 是否完成过(非最后一次请求)
     */
    hasBeenFetch: boolean
    error: Error | null
    params: Parameters<T> | undefined
    data: D
  }>(() => {
    return {
      state: FetchState.Unstart,
      hasBeenSuccess: false,
      hasBeenFetch: false,
      params: undefined,
      error: null,
      data: initialData ? dispatchValue(initialData, null) : (null as any)
    }
  })

  const recordRef = useLatest(record)

  /**
   * data 为普通对象时，可以只更新部分属性
   */
  const setData = useCallback((data: React.SetStateAction<D>) => {
    const oldData = recordRef.current?.data as any
    const newData = dispatchValue(data, oldData)
    setRecord({
      data:
        isObject(newData) && !isArray(newData)
          ? {
            ...oldData,
            ...newData
          }
          : newData
    })
  }, []) as DataDispatch<D>

  const actionRef = useLatest(action)
  const optionsRef = useLatest(options)

  const mountedRef = useRef(false)

  const fetchStates = useMemo(() => {
    return {
      loading: record.state == FetchState.Loading,
      success: record.state == FetchState.Success,
      failed: record.state == FetchState.Failed,
      fetched: record.state > FetchState.Loading
    }
  }, [record])

  const fetch = useCallback(async (...args: any[]) => {
    setRecord({ state: FetchState.Loading })

    let response, gcErrorIns: Error | undefined

    const options = optionsRef.current

    const params: any = args && args.length ? args : options.params || []

    try {
      let data: any = null

      response = await actionRef.current.apply(null, params)

      if (response) {
        if (hasProp(response, 'data') && (response.config) /* axios */) {

          if (hasProp(response.data, 'code')) {
            data = response.data.data
          } else {
            data = response.data
          }
        } else {
          data = response
        }
      }
      setRecord({
        state: FetchState.Success,
        hasBeenSuccess: true,
        hasBeenFetch: true,
        error: null,
        params,
        data
      })
    } catch (error: any) {
      const gcErr = (gcErrorIns = error)
      onError && onError(gcErr)

      console.error(`[useApi]: ${action.name} ${gcErr.code == -2 ? '异常' : '请求错误'}`, 'options:', options, gcErr)

      setRecord({
        state: FetchState.Failed,
        error: gcErr,
        data: initialData ? dispatchValue(initialData, recordRef.current?.data) : (null as any),
        params,
        hasBeenFetch: true
      })

      throw error
    } finally {
      onFinished && onFinished(response, gcErrorIns)
    }
    return response
  }, [])

  useEffect(() => {
    if (mountedRef.current || (immediately && !mountedRef.current)) {
      if (auto) {
        fetch()
      }
    }

    mountedRef.current = true
  }, [])

  return {
    ...fetchStates,
    ...record,
    fetch: fetch as T,
    mutate: setData
  }
}

enum FetchState {
  Unstart = -1,
  Loading = 0,
  Success = 1,
  Failed = 2,
  Canceled = 3
}

// export type ApiAction = (...args: any[]) => Promise<any>

export type ApiData<Res> = Res extends ApiResponse<infer D>
  ? D
  : Res extends AxiosResponse<infer D2>
  ? D2
  : Res

type DataDispatch<D> = D extends any[] ? Dispath<D> : D extends Record<any, any> ? Dispath<Partial<D>> : Dispath<D>

type Dispath<S> = React.Dispatch<React.SetStateAction<S>>


type PromiseValue<F extends Function> = F extends (...args: any[]) => Promise<infer V> ? V : never