export interface ApiResponse<D = any> {
  data: D
  ok: boolean
  msg: string
  code: number
}

export interface PaginationData<T = any> {
  list: Array<T>
  page: number
  size: number
  total: number
  totalPages: number
}

export type ApiPaginationResponse<T = any> = ApiResponse<PaginationData<T>>