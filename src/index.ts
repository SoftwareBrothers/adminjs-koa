import buildRouter from './buildRouter'
import buildAuthenticatedRouter from './buildAuthenticatedRouter'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')

export default {
  buildRouter,
  buildAuthenticatedRouter,
  version,
  name: 'AdminBroKoa',
}
