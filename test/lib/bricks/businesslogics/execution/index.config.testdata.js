'use strict';

const config = {
  name: 'base-businesslogic',
  module: './bricks/businesslogics/executions/index.js',
  properties: {
    executionApiUrl: 'http://localhost:3010/eds/',
    schedulerApiUrl: 'http://localhost:3011/sch/',
    jobManagerApiUrl: 'http://localhost:3012/jms/',
  },
  publish: [],
  subscribe: [
    {
      topic: 'bl.base',
      data: [
        {},
      ],
    },
  ],
};

module.exports = config;
