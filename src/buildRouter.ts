import AdminBro from 'admin-bro'
import formidableMiddleware from 'koa2-formidable'
import Router from '@koa/router'
import Application from 'koa'
import { addAdminBroRoutes, verifyAdminBro } from './utils'
import { DEFAULT_ROOT_PATH, INITIALIZED_MESSAGE } from './constants'

/**
 * Builds regular koa router.
 * @memberof module:@admin-bro/koa
 *
 * @param {AdminBro}    admin      AdminBro instance
 * @param {Application} app        koa application created by `new Koa()`
 * @param {Router}      [predefinedRouter] if you have any predefined router
 *    pass it here
 * @param {FormidableOptions} formidableOptions options passed to formidable
 *    module {@link https://github.com/node-formidable/formidable#options}
 * @return  {Router}  @koa/router
 */
const buildRouter = (
  admin: AdminBro,
  app: Application,
  predefinedRouter?: Router,
  formidableOptions?: any,
): Router => {
  verifyAdminBro(admin)

  admin.initialize().then(() => {
    console.log(INITIALIZED_MESSAGE)
  })

  const router = predefinedRouter || new Router({
    prefix: admin.options.rootPath || DEFAULT_ROOT_PATH,
  })

  router.use(formidableMiddleware(formidableOptions))

  addAdminBroRoutes(admin, router, app)

  return router
}

export default buildRouter
