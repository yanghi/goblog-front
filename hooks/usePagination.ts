import { useMemo } from 'react'

import { ApiData, useApi, UseApiOptions } from './useApi'


import { useMemoizedFn } from 'ahooks'
import { PaginationData } from '../struct/response'
import { getObjectValue, hasProp } from '../utils/util'
import { PaginationParams } from '../struct/api'

interface usePaginationOptions<T extends any[], R, D> extends UseApiOptions<T, R, D> {
  pageSize?: number
  /**
   * 分页信息数据,通常是在返回数据的根属性上或者`page`,如果不是,需要用此函数返回
   * 如果是字符串,将使用`getProp`获取
   * @example
   * getPaginationInfo(data) {
   *   return data.packageList
   * }
   * // or
   * getPaginationInfo: 'packageList'
   */
  getPaginationInfo?: ((data: D) => PaginationData) | string
}

export const usePagination = <
  T extends PaginationApiAction,
  R extends PromiseValue<T>,
  D extends ApiData<R>
>(
  action: T,
  options: usePaginationOptions<Parameters<T>, R, D> = {}
) => {


  const result = useApi(action, options as any)

  const defaultPageSize = options.pageSize || 10

  const paginationRespone = useMemo(() => {
    const defaultInfo = {
      total: 0,
      pages: 1
    }

    const info: PaginationData = Object.assign(
      defaultInfo,
      getObjectValue(options.getPaginationInfo || ((data) => data), result.data)
    )

    if (result.data && !hasProp(info, 'page'))
      console.error(`[usePagination]: 未获取到有效分页信息, getPaginationInfo:`, options.getPaginationInfo)
    return info
  }, [result.data])

  const paginationParams: PaginationInfo = Object.assign(
    {
      page: 1,
      size: defaultPageSize
    },
    result.params ? result.params[0] : {}
  )

  const onChange = (page: number, pageSize?: number) => {
    const [pgParams, ...rest] = options.params || []

    const ps = {
      ...pgParams,
      ...paginationParams,
      page: page || 1
    }

    if (pageSize) {
      ps.size = pageSize
    }

    result.fetch.apply(null, [ps].concat(rest) as any)
  }

  const prev = () => {
    if (paginationParams.page < 2) return

    onChange(paginationParams.page - 1)
  }
  const next = () => {
    if (paginationParams.page >= paginationRespone.totalPages) return

    onChange(paginationParams.page + 1)
  }

  // useEffect(() => {
  //   immediately && onChange(1)
  // }, [])

  return {
    ...result,
    pagination: {
      current: paginationParams.page,
      pageSize: paginationParams.size,
      total: paginationRespone.total,
      totalPages: paginationRespone.totalPages,
      onChange: useMemoizedFn(onChange),
      prev: useMemoizedFn(prev),
      next: useMemoizedFn(next)
    }
  }
}


type PaginationInfo = Required<PaginationParams>
type PaginationApiAction =
  | ((params: PaginationParams & Record<any, any>, ...arg: any[]) => Promise<any>)
  | ((params: any, ...arg: any[]) => Promise<any>)
type PromiseValue<F extends Function> = F extends (...args: any[]) => Promise<infer V> ? V : never
