/* eslint-disable no-underscore-dangle */
import Router from '@koa/router'
import AdminJS, { ActionRequest, Router as AdminJSRouter, CurrentAdmin } from 'adminjs'
import type { Files } from 'formidable'
import Application, { Middleware, ParameterizedContext, Request } from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import path from 'path'

import {
  ADMINJS_ERROR_MESSAGE,
  ADMINJS_ERROR_NAME,
  ADMINJS_PACKAGE_NAME, DEFAULT_ROOT_PATH,
  INVALID_CREDENTIALS_ERROR_MESSAGE,
} from './constants.js'
import { KoaAuthOptions } from './types.js'

const MISSING_PROVIDER_ERROR = '"provider" has to be configured to use refresh token mechanism'

type RequestWithFiles = Request & {
  files: Files;
};

const addAdminJsRoutes = (admin: AdminJS, router: Router, app: Application): void => {
  const { routes } = AdminJSRouter

  routes.forEach((route) => {
    const koaPath = route.path.replace(/{/g, ':').replace(/}/g, '')

    const handler: Middleware = async (ctx) => {
      const {
        request,
        method,
        response,
        params,
        session,
      } = ctx as (typeof ctx & { request: RequestWithFiles })

      try {
        const controller = new route.Controller({ admin }, session && session.adminUser)
        const actionRequest: ActionRequest = {
          ...request,
          method: method.toLowerCase() as ActionRequest['method'],
          params,
          query: request.query,
          payload: {
            ...((request as any).body || {}),
            ...(request.files || {}),
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
    mount(
      admin.options.rootPath + asset.path,
      serve(path.dirname(asset.src), { index: path.basename(asset.src) }),
    ),
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
  let { loginPath, logoutPath, refreshTokenPath } = admin.options
  loginPath = loginPath.replace(DEFAULT_ROOT_PATH, '')
  logoutPath = logoutPath.replace(DEFAULT_ROOT_PATH, '')
  refreshTokenPath = refreshTokenPath.replace(DEFAULT_ROOT_PATH, '')

  const { provider } = auth
  const providerProps = provider?.getUiProps() ?? {}

  router.get(loginPath, async (ctx) => {
    const baseProps = {
      action: rootPath + loginPath,
      errorMessage: null,
    }

    ctx.body = await admin.renderLogin({
      ...baseProps,
      ...providerProps,
    })
  })

  router.post(loginPath, async (ctx: ParameterizedContext) => {
    if (ctx.session == null) {
      throw new Error('Invalid state, no session object in context')
    }

    let adminUser
    if (provider) {
      adminUser = await provider.handleLogin(
        {
          headers: ctx.request.headers ?? {},
          query: ctx.request.query ?? {},
          params: ctx.params ?? {},
          data: ctx.request.body ?? {},
        },
        ctx,
      )
    } else {
      const { email, password } = ctx.request.body as {
        email: string;
        password: string;
      }
      // "auth.authenticate" must always be defined if "auth.provider" isn't
      adminUser = await auth.authenticate!(email, password, ctx)
    }

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
        action: admin.options.loginPath,
        errorMessage: INVALID_CREDENTIALS_ERROR_MESSAGE,
      })
    }
  })

  router.get(logoutPath, async (ctx: ParameterizedContext) => {
    if (provider) {
      await provider.handleLogout(ctx)
    }

    ctx.session = null
    ctx.redirect(rootPath + loginPath)
  })

  router.post(refreshTokenPath, async (ctx: ParameterizedContext) => {
    if (ctx.session == null) {
      throw new Error('Invalid state, no session object in context')
    }

    if (!provider) {
      throw new Error(MISSING_PROVIDER_ERROR)
    }

    const updatedAuthInfo = await provider.handleRefreshToken(
      {
        data: ctx.request.body ?? {},
        query: ctx.request.query ?? {},
        params: ctx.params ?? {},
        headers: ctx.request.headers,
      },
      ctx,
    )

    let adminObject = ctx.session.adminUser as Partial<CurrentAdmin> | null
    if (!adminObject) {
      adminObject = {}
    }

    if (!adminObject._auth) {
      adminObject._auth = {}
    }

    adminObject._auth = {
      ...adminObject._auth,
      ...updatedAuthInfo,
    }

    ctx.session.adminUser = adminObject
    ctx.body = adminObject
    ctx.session.save()
  })

  router.use(async (ctx: ParameterizedContext, next) => {
    if (ctx.session == null) {
      throw new Error('Invalid state, no session object in context')
    }

    if (AdminJSRouter.assets.find((asset) => ctx.request.originalUrl.match(asset.path))) {
      await next()
    } else if (AdminJSRouter.routes.find((r) => r.action === 'bundleComponents') && ctx.request.originalUrl.match('components.bundle.js')) {
      await next()
    } else if (ctx.session.adminUser) {
      await next()
    } else {
      const [redirectTo] = ctx.request.originalUrl.split('/actions')
      ctx.session.redirectTo = redirectTo.includes(`${rootPath}/api`) ? rootPath : redirectTo
      ctx.redirect(rootPath + loginPath)
    }
  })
}

export {
  addAdminJsRoutes,
  addAdminJsAuthRoutes,
  verifyAdminJs,
}
