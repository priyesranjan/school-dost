import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean
    skipLogoutOnAuthFailure?: boolean
  }

  interface InternalAxiosRequestConfig {
    _retry?: boolean
    skipAuthRefresh?: boolean
    skipLogoutOnAuthFailure?: boolean
  }
}
