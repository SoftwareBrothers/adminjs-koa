import AdminJS from 'adminjs'
import AdminJSKoa from '@adminjs/koa'
import Koa from 'koa'

const PORT = 3000

const start = async () => {
  const app = new Koa()
  const admin = new AdminJS({
    resources: [],
    rootPath: '/',
  })

  const router = AdminJSKoa.buildRouter(admin, app)

  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(PORT, () => {
    console.log(`AdminJS available at http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()
