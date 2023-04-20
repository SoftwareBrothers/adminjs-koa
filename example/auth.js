import AdminJS from 'adminjs'
import AdminJSKoa from '@adminjs/koa'
import Koa from 'koa'

const PORT = 3000

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

const start = async () => {
  const app = new Koa()

  const admin = new AdminJS({
    resources: [],
    rootPath: '/admin',
  })

  app.keys = ['your secret for koa cookie']
  const router = AdminJSKoa.buildAuthenticatedRouter(admin, app, {
    authenticate,
    sessionOptions: {
      // You may configure your Koa session here
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      renew: true,
    },
  })

  app.use(router.routes()).use(router.allowedMethods())

  app.listen(PORT, () => {
    console.log(
      `AdminJS available at http://localhost:${PORT}${admin.options.rootPath}`,
    )
  })
}

start()
