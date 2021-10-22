import AdminJS from 'adminjs'
import formidableMiddleware from 'koa2-formidable'
import Router from '@koa/router'
import Application from 'koa'
import { addAdminJsRoutes, verifyAdminJs } from './utils'
import { DEFAULT_ROOT_PATH, INITIALIZED_MESSAGE } from './constants'

/**
 * Builds regular koa router.
 * @memberof module:@adminjs/koa
 *
 * @param {AdminJS}     admin      AdminJS instance
 * @param {Application} app        koa application created by `new Koa()`
 * @param {Router}      [predefinedRouter] if you have any predefined router
 *    pass it here
 * @param {FormidableOptions} formidableOptions options passed to formidable
 *    module {@link https://github.com/node-formidable/formidable#options}
 * @return  {Router}  @koa/router
 */
const buildRouter = (
  admin: AdminJS,
  app: Application,
  predefinedRouter?: Router,
  formidableOptions?: Record<string, any>,
): Router => {
  verifyAdminJs(admin)

  admin.initialize().then(() => {
    // eslint-disable-next-line no-console
    console.log(INITIALIZED_MESSAGE)
  })

  const router = predefinedRouter || new Router({
    prefix: admin.options.rootPath || DEFAULT_ROOT_PATH,
  })

  router.use(formidableMiddleware(formidableOptions))

  addAdminJsRoutes(admin, router, app)

  return router
}

export default buildRouter
