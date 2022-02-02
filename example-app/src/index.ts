import Koa from 'koa'
import AdminJS from 'adminjs'
import AdminJSKoa from '@adminjs/koa'
import mongoose from 'mongoose'
import mongooseAdapter from '@adminjs/mongoose'
import './mongoose/admin-model'
import './mongoose/article-model'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-json')({ path: 'cypress.env.json' })

const PORT = 3000

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'password',
}

AdminJS.registerAdapter(mongooseAdapter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const simpleRouter = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/koa-example')
  const app = new Koa()

  const admin = new AdminJS({
    databases: [connection],
    rootPath: '/admin',
  })

  const router = AdminJSKoa.buildRouter(admin, app)

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
    process.env.MONGO_URL || 'mongodb://localhost:27017/koa-example', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    },
  )
  const app = new Koa()

  // in a real-world app the keys should be more complicated
  app.keys = ['secret1', 'secret2']

  const admin = new AdminJS({
    databases: [connection],
    rootPath: '/admin',
  })

  const router = AdminJSKoa.buildAuthenticatedRouter(admin, app, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
      }
      return null
    },
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
