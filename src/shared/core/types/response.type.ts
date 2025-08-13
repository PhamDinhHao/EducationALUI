export type GlobalResponse<T> = {
  success: boolean
  data: T
  message: string
  errors?: {
    path: string
    message: string
  }[]
}
