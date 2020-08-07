import AdminBro from 'admin-bro';
import formidableMiddleware from 'koa2-formidable'
import Router from '@koa/router'
import Application from 'koa';
import { addAdminBroRoutes, verifyAdminBro } from './utils'
import { DEFAULT_ROOT_PATH, INITIALIZED_MESSAGE } from './constants';

const buildRouter = (admin: AdminBro, app: Application, predefinedRouter?: Router, formidableOptions?: Object) => {
  verifyAdminBro(admin)

  admin.initialize().then(() => {
    console.log(INITIALIZED_MESSAGE)
  })

  const router = predefinedRouter || new Router({ prefix: admin.options.rootPath || DEFAULT_ROOT_PATH })

  router.use(formidableMiddleware(formidableOptions))

  addAdminBroRoutes(admin, router, app)

  return router
}

export default buildRouter
