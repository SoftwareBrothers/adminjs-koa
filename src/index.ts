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
 * now you can use either {@link module:@admin-bro/koa.buildRouter buildRouter} or
 * {@link module:@admin-bro/koa.buildAuthenticatedRouter buildAuthenticatedRouter} functions.
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
 *
 * const Koa = require('koa');
 * const app = new Koa();
 *
 * const adminBro = new AdminBro({
 *   databases: [],
 *   rootPath: '/admin',
 * })
 *
 * const router = buildRouter(adminBro, app)
 *
 * app
 *   .use(router.routes())
 *   .use(router.allowedMethods())
 *
 * app.listen(3000)
 * ```
 *
 * ## Using build in authentication
 *
 * Plugin gives you a second method:
 * {@link module:@admin-bro/koa.buildAuthenticatedRouter buildAuthenticatedRouter}. In order
 * to have sign in logic out of the box - you can use it.
 *
 * ### Example with build in authentication
 *
 * Build in authentication is using cookie. So in order to make it work you have to set
 * set koa [app.keys](https://koajs.com/#app-keys-):
 *
 * ```
 * const app = new Koa();
 * app.keys = ['super-secret1', super-'secret2']
 * ```
 *
 * And this is how {@link module:@admin-bro/koa.buildAuthenticatedRouter buildAuthenticatedRouter}
 * might look like:
 *
 * ```
 * const router = buildAuthenticatedRouter(adminBro, app, {
 *     authenticate: async (email, password) => {
 *       const user = await User.findOne({ email })
 *       if (password && user && await argon2.verify(user.encryptedPassword, password)){
 *         return user.toJSON()
 *       }
 *       return null
 *     },
 *   })
 * ```
 *
 * - We used [argon2](https://www.npmjs.com/package/argon2) to decrypt the password.
 * - In the example User is a [mongoose](https://mongoosejs.com/) model.
 *
 *
 * ## Adding custom authentication
 *
 * You can add your custom authentication setup by firstly creating the router and then
 * passing it via the `predefinedRouter` option.
 *
 * In this predefined router you can protect the routes with a session
 * authentication where you can use any middleware you want.
 * Furthermore, you can create your own sign-in/sign-up form.
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
