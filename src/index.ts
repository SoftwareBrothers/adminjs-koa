import buildRouter from './buildRouter'
import buildAuthenticatedRouter from './buildAuthenticatedRouter';

const { version } = require('../package.json')

export default {
  buildRouter,
  buildAuthenticatedRouter,
  version,
  name: 'AdminBroKoa'
}
