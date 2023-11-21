/* eslint-disable global-require */
import Router from '@koa/router'
import AdminJS from 'adminjs'
import Application from 'koa'
import session from 'koa-session'
import formidableMiddleware from 'koa2-formidable'

import { DEFAULT_ROOT_PATH } from './constants.js'
import { KoaAuthOptions } from './types.js'
import { addAdminJsAuthRoutes, addAdminJsRoutes } from './utils.js'

const MISSING_AUTH_CONFIG_ERROR = 'You must configure either "authenticate" method or assign an auth "provider"'
const INVALID_AUTH_CONFIG_ERROR = 'You cannot configure both "authenticate" and "provider". "authenticate" will be removed in next major release.'

/**
 * Builds authenticated koa router.
 * @memberof module:@adminjs/koa
 *
 * @param {AdminJS}         admin      AdminJS instance
 * @param {Application}     app        koa application created by `new Koa()`
 * @param {KoaAuthOptions}  auth       authentication options
 * @param {Router}          [predefinedRouter] if you have any predefined router
 *    pass it here
 * @param {FormidableOptions} formidableOptions options passed to formidable
 *    module {@link https://github.com/node-formidable/formidable#options}
 * @return  {Router}  @koa/router
 */
const buildAuthenticatedRouter = (
  admin: AdminJS,
  app: Application,
  auth: KoaAuthOptions,
  predefinedRouter?: Router,
  formidableOptions?: Record<string, any>,
): Router => {
  if (!auth.authenticate && !auth.provider) {
    throw new Error(MISSING_AUTH_CONFIG_ERROR)
  }

  if (auth.authenticate && auth.provider) {
    throw new Error(INVALID_AUTH_CONFIG_ERROR)
  }

  if (auth.provider) {
    // eslint-disable-next-line no-param-reassign
    admin.options.env = {
      ...admin.options.env,
      ...auth.provider.getUiProps(),
    }
  }

  const router = predefinedRouter || new Router({
    prefix: admin.options.rootPath || DEFAULT_ROOT_PATH,
  })

  router.use(formidableMiddleware(formidableOptions))

  app.use(auth.sessionOptions ? session(auth.sessionOptions, app) : session(app))

  addAdminJsAuthRoutes(admin, router, auth)
  addAdminJsRoutes(admin, router, app)

  return router
}

export default buildAuthenticatedRouter
