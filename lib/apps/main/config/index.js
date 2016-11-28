'use strict';

const load = require('cta-common').loader;

module.exports = {
  name: 'execution-dataservice',
  tools: load.asArray('tools', __dirname),
  bricks: load.asArray('bricks', __dirname),
  properties: {
    executionApiUrl: 'http://eds:3010/',
    schedulerApiUrl: 'http://sds:3011/',
    jobManagerApiUrl: 'http://jobmanager:3012/',
  },
};
