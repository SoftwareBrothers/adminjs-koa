/* eslint-disable global-require */
import AdminBro from 'admin-bro'
import Router from '@koa/router'
import formidableMiddleware from 'koa2-formidable'
import Application from 'koa'
import { addAdminBroAuthRoutes, addAdminBroRoutes } from './utils'
import { DEFAULT_ROOT_PATH } from './constants'
import { Auth } from './types'

let session

try {
  session = require('koa-session')
} catch (e) {
  // eslint-disable-next-line no-console
  console.info('koa-session was not loaded')
}

const buildAuthenticatedRouter = (
  admin: AdminBro,
  app: Application,
  auth: Auth,
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
