'use strict';

const load = require('cta-common').loader;

module.exports = {
  name: 'execution-dataservice',
  tools: load.asArray('tools', __dirname),
  bricks: load.asArray('bricks', __dirname),
};
