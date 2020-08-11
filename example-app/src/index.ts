import Koa from 'koa'
import AdminBro from 'admin-bro'
import adminBroKoa from '@admin-bro/koa'
import mongoose from 'mongoose'
import mongooseAdapter from '@admin-bro/mongoose'
import './mongoose/admin-model'
import './mongoose/article-model'

const PORT = 3000

const ADMIN = {
  email: 'test@example.com',
  password: 'password',
}

AdminBro.registerAdapter(mongooseAdapter)

const simpleRouter = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/example')
  const app = new Koa()

  const admin = new AdminBro({
    databases: [connection],
    rootPath: '/admin',
  })

  const router = adminBroKoa.buildRouter(admin, app)

  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

const authenticatedRouter = async () => {
  const connection = await mongoose.connect(
    process.env.MONGO_URL || 'mongodb://localhost:27017/example', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  const app = new Koa()

  // in a real-world app the keys should be more complicated
  app.keys = ['secret1', 'secret2']

  const admin = new AdminBro({
    databases: [connection],
    rootPath: '/admin',
  })

  const router = adminBroKoa.buildAuthenticatedRouter(admin, app, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
      }
      return null
    },
    cookiePassword: 'password',
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

// simpleRouter()
authenticatedRouter()
