declare module 'koa2-formidable' {
  import { Middleware } from 'koa'

  export type FormidableOptions = any

  type FormidableMiddleware = (options?: FormidableOptions) => Middleware

  const FormidableMiddleware: FormidableMiddleware

  export default FormidableMiddleware
}
