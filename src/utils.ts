import Router from '@koa/router'
import Application, { ParameterizedContext, Middleware } from 'koa'
import AdminJS, { ActionRequest, Router as AdminJSRouter } from 'adminjs'
import mount from 'koa-mount'
import serve from 'koa-static'
import path from 'path'
import {
  ADMINJS_ERROR_MESSAGE,
  ADMINJS_ERROR_NAME,
  ADMINJS_PACKAGE_NAME, DEFAULT_ROOT_PATH,
  INVALID_CREDENTIALS_ERROR_MESSAGE,
} from './constants'
import { KoaAuthOptions } from './types'

const addAdminJsRoutes = (admin: AdminJS, router: Router, app: Application): void => {
  const { routes } = AdminJSRouter

  routes.forEach((route) => {
    const koaPath = route.path.replace(/{/g, ':').replace(/}/g, '')

    const handler: Middleware = async (ctx) => {
      const { request, method, response, params, session } = ctx
      try {
        const controller = new route.Controller({ admin }, session && session.adminUser)
        const actionRequest: ActionRequest = {
          ...request,
          method: method.toLowerCase() as ActionRequest['method'],
          params,
          query: request.query,
          payload: {
            ...(request.body || {}),
          },
        }
        const html = await controller[route.action](actionRequest, response)

        if (route.contentType) {
          response.set({ 'Content-Type': route.contentType })
        }

        if (html) {
          ctx.body = html
        }
      } catch (e) {
        ctx.throw(e)
      }
    }
    // if path is an empty string koa-router doesn't apply the prefix correctly hence the workaround
    const pathToNavigate = koaPath === '' ? '/' : koaPath

    if (route.method === 'GET') {
      router.get(pathToNavigate, handler)
    }

    if (route.method === 'POST') {
      router.post(pathToNavigate, handler)
    }
  })

  const { assets } = AdminJSRouter

  assets.forEach((asset) => app.use(
    mount(admin.options.rootPath + asset.path,
      serve(path.dirname(asset.src), { index: path.basename(asset.src) })),
  ))
}

const verifyAdminJs = (admin: AdminJS): void => {
  if (!admin || admin.constructor.name !== ADMINJS_PACKAGE_NAME) {
    const e = new Error(ADMINJS_ERROR_MESSAGE)
    e.name = ADMINJS_ERROR_NAME
    throw e
  }
}

const addAdminJsAuthRoutes = (admin: AdminJS, router: Router, auth: KoaAuthOptions): void => {
  const { rootPath } = admin.options
  let { loginPath, logoutPath } = admin.options
  loginPath = loginPath.replace(DEFAULT_ROOT_PATH, '')
  logoutPath = logoutPath.replace(DEFAULT_ROOT_PATH, '')

  router.get(loginPath, async (ctx) => {
    ctx.body = await admin.renderLogin({
      action: rootPath + loginPath,
      errorMessage: null,
    })
  })

  router.post(loginPath, async (ctx: ParameterizedContext) => {
    if (ctx.session == null) {
      throw new Error('Invalid state, no session object in context')
    }

    const { email, password } = ctx.request.body
    const adminUser = await auth.authenticate(email, password)
    if (adminUser) {
      ctx.session.adminUser = adminUser
      ctx.session.save()
      if (ctx.session.redirectTo) {
        ctx.redirect(ctx.session.redirectTo)
      } else {
        ctx.redirect(rootPath)
      }
    } else {
      ctx.body = await admin.renderLogin({
        action: loginPath,
        errorMessage: INVALID_CREDENTIALS_ERROR_MESSAGE,
      })
    }
  })

  router.use(async (ctx: ParameterizedContext, next) => {
    if (ctx.session == null) {
      throw new Error('Invalid state, no session object in context')
    }

    if (AdminJSRouter.assets.find((asset) => ctx.request.originalUrl.match(asset.path))) {
      await next()
    } else if (ctx.session.adminUser) {
      await next()
    } else {
      const [redirectTo] = ctx.request.originalUrl.split('/actions')
      ctx.session.redirectTo = redirectTo.includes(`${rootPath}/api`) ? rootPath : redirectTo
      ctx.redirect(rootPath + loginPath)
    }
  })

  router.get(logoutPath, async (ctx: ParameterizedContext) => {
    ctx.session = null
    ctx.redirect(rootPath + loginPath)
  })
}

export {
  addAdminJsRoutes,
  addAdminJsAuthRoutes,
  verifyAdminJs,
}
