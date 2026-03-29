/**
 * API 响应类型定义
 */

/** 通用API响应接口 */
export interface ApiResponse<T = unknown> {
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
}

/** 分页结果接口 */
export interface PageResult<T> {
  /** 数据列表 */
  list: T[]
  /** 总数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/** 分页请求参数 */
export interface PageParams {
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/** 错误响应接口 */
export interface ApiError {
  /** 错误码 */
  code: number
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details?: Record<string, unknown>
}

/** 请求配置接口 */
export interface RequestConfig {
  /** 请求URL */
  url: string
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** 请求数据 */
  data?: Record<string, unknown>
  /** 请求头 */
  header?: Record<string, string>
  /** 超时时间 */
  timeout?: number
  /** 是否显示loading */
  showLoading?: boolean
  /** loading文字 */
  loadingText?: string
}

/** 上传文件响应 */
export interface UploadResponse {
  /** 文件URL */
  url: string
  /** 文件名 */
  filename: string
  /** 文件大小 */
  size: number
  /** 文件类型 */
  mimetype: string
}
