export interface FieldError {
  field: string
  message: string
}

export interface ApiErrorResponse {
  detail: string
  errors: FieldError[]
}

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors?: FieldError[]

  constructor(status: number, payload?: ApiErrorResponse) {
    super(payload?.detail)
    this.name = "ApiError"
    this.status = status
    this.fieldErrors = payload?.errors
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError
}
