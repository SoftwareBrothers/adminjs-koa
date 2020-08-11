/**
 * @module @admin-bro/koa
 * @description
 *
 * This is an official plugin allowing you to run AdminBro on
 * [koa framework](https://koajs.com/).
 *
 * ## installation
 *
 * Assuming you have koa installed, you have to also install this
 * package along with its peerDependencies:
 *
 * ```
 * yarn add admin-bro @admin-bro/koa @koa/router koa2-formidable
 * ```
 *
 * now you can use either {@link module:@admin-bro/koa.buildRouter} or
 * {@link module:@admin-bro/koa.buildAuthenticatedRouter} functions.
 *
 * ## Usage
 *
 * ```javascript
 * const { buildRouter } = require('@admin-bro/koa')
 * // or
 * const { buildAuthenticatedRouter } = require('@admin-bro/koa')
 * ```
 *
 * As you can see it exposes 2 methods that create an Koa Router, which can be attached
 * to a given url in the API. Each method takes a pre-configured instance
 * of {@link AdminBro}.
 *
 * If you want to use a router you have already created - not a problem. Just pass it
 * as a `predefinedRouter` parameter.
 *
 * You may want to use this option when you want to include
 * some custom auth middleware for you AdminBro routes.
 *
 * ## Example without an authentication
 *
 * ```
 * const AdminBro = require('admin-bro')
 * const { buildRouter } = require('@admin-bro/koa')
 * const Koa = require('koa');
 *
 * const app = new Koa();
 *
 * const adminBro = new AdminBro({
 *   databases: [],
 *   rootPath: '/admin',
 * })
 *
 * const router = buildRouter(adminBro)
 * app.use(adminBro.options.rootPath, router)
 * app.listen(3000)
 * ```
 *
 * ## Using build in authentication
 *
 * To protect the routes with a session authentication, you can use predefined
 * {@link module:@admin-bro/express.buildAuthenticatedRouter} method.
 *
 * Note! To use authentication in production environment, there is a need to configure
 * express-session for production build. It can be achieved by passing options to
 * `sessionOptions` parameter. Read more on [express/session Github page](https://github.com/expressjs/session)
 *
 * ## Adding custom authentication
 *
 * You can add your custom authentication setup by firstly creating the router and then
 * passing it via the `predefinedRouter` option.
 *
 * ```
 * let router = express.Router()
 * router.use((req, res, next) => {
 *   if (req.session && req.session.admin) {
 *     req.session.adminUser = req.session.admin
 *     next()
 *   } else {
 *     res.redirect(adminBro.options.loginPath)
 *   }
 * })
 * router = AdminBroExpress.buildRouter(adminBro, router)
 * ```
 *
 * Where `req.session.admin` is {@link AdminBro#CurrentAdmin},
 * meaning that it should have at least an email property.
 */

import buildRouter from './buildRouter'
import buildAuthenticatedRouter from './buildAuthenticatedRouter'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')

const name = 'AdminBroKoa'

const defaultExport = {
  buildRouter,
  buildAuthenticatedRouter,
  version,
  name,
}

export {
  buildRouter,
  buildAuthenticatedRouter,
  version,
  name,
  defaultExport as default,
}
