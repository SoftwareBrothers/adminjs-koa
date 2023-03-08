/**
 * @module @adminjs/koa
 * @description
 *
 * This is an official plugin allowing you to run AdminJS on
 * [koa framework](https://koajs.com/).
 *
 * ## installation
 *
 * Assuming you have koa installed, you have to also install this
 * package along with its peerDependencies:
 *
 * ```
 * yarn add adminjs @adminjs/koa @koa/router koa2-formidable
 * ```
 *
 * now you can use either {@link module:@adminjs/koa.buildRouter buildRouter} or
 * {@link module:@adminjs/koa.buildAuthenticatedRouter buildAuthenticatedRouter} functions.
 *
 * ## Usage
 *
 * ```javascript
 * const { buildRouter } = require('@adminjs/koa')
 * // or
 * const { buildAuthenticatedRouter } = require('@adminjs/koa')
 * ```
 *
 * As you can see it exposes 2 methods that create an Koa Router, which can be attached
 * to a given url in the API. Each method takes a pre-configured instance
 * of {@link AdminJS}.
 *
 * If you want to use a router you have already created - not a problem. Just pass it
 * as a `predefinedRouter` parameter.
 *
 * You may want to use this option when you want to include
 * some custom auth middleware for you AdminJS routes.
 *
 * ## Example without an authentication
 *
 * ```
 * const AdminJS = require('adminjs')
 * const { buildRouter } = require('@adminjs/koa')
 *
 * const Koa = require('koa');
 * const app = new Koa();
 *
 * const adminJs = new AdminJS({
 *   databases: [],
 *   rootPath: '/admin',
 * })
 *
 * const router = buildRouter(adminJs, app)
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
 * {@link module:@adminjs/koa.buildAuthenticatedRouter buildAuthenticatedRouter}. In order
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
 * And this is how {@link module:@adminjs/koa.buildAuthenticatedRouter buildAuthenticatedRouter}
 * might look like:
 *
 * ```
 * const router = buildAuthenticatedRouter(AdminJS, app, {
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

import buildAuthenticatedRouter from './buildAuthenticatedRouter.js';
import buildRouter from './buildRouter.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { version } = require('../package.json')
import packageJson from '../package.json';
const version = packageJson.version;


const name = 'AdminJSKoa'

export type KoaPlugin = {
  name: string;
  buildAuthenticatedRouter: typeof buildAuthenticatedRouter;
  buildRouter: typeof buildRouter;
  version: typeof version;
};


const plugin: KoaPlugin = { name, buildAuthenticatedRouter, buildRouter, version };

export default plugin;

export {
  buildRouter,
  buildAuthenticatedRouter,
  version,
  name
};

