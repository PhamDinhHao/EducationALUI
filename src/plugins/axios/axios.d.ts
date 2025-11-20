import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    isShowMessage?: boolean
  }

  export interface InternalAxiosRequestConfig {
    isShowMessage?: boolean
  }
}
