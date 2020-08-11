/* eslint-disable global-require */
import AdminBro from 'admin-bro'
import Router from '@koa/router'
import formidableMiddleware from 'koa2-formidable'
import Application from 'koa'
import { addAdminBroAuthRoutes, addAdminBroRoutes } from './utils'
import { DEFAULT_ROOT_PATH } from './constants'
import { KoaAuthOptions } from './types'

let session

try {
  session = require('koa-session')
} catch (e) {
  // eslint-disable-next-line no-console
  console.info('koa-session was not loaded')
}

/**
 * Builds regular koa router.
 * @memberof module:@admin-bro/koa
 *
 * @param {AdminBro}    admin      AdminBro instance
 * @param {Application} app        koa application created by `new Koa()`
 * @param {KoaAuthOptions} auth       authentication options
 * @param {Router}      [predefinedRouter] if you have any predefined router
 *    pass it here
 * @param {FormidableOptions} formidableOptions options passed to formidable
 *    module {@link https://github.com/node-formidable/formidable#options}
 * @return  {Router}  @koa/router
 */
const buildAuthenticatedRouter = (
  admin: AdminBro,
  app: Application,
  auth: KoaAuthOptions,
  predefinedRouter?: Router,
  formidableOptions?: any,
): Router => {
  if (!session) {
    throw new Error(['In order to use authentication, you have to install',
      'koa-session package',
    ].join(' '))
  }

  const router = predefinedRouter || new Router({
    prefix: admin.options.rootPath || DEFAULT_ROOT_PATH,
  })

  router.use(formidableMiddleware(formidableOptions))

  app.use(session(app))

  addAdminBroAuthRoutes(admin, router, auth)
  addAdminBroRoutes(admin, router, app)

  return router
}

export default buildAuthenticatedRouter
