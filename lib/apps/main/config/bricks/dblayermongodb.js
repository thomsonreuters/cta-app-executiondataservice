'use strict';

module.exports = {
  name: 'dblayer-mongodb',
  module: 'cta-dblayer',
  properties: {
    provider: 'mongodb',
    configuration: {
      databaseName: 'oss',
      servers: [
        {
          host: 'mongo',
          port: 27017,
        },
      ],
      options: {},
    },
  },
  publish: [],
  subscribe: [
    {
      topic: 'dblayer',
      data: [
        {
          nature: {
            type: 'database',
            quality: 'query',
          },
        },
      ],
    },
  ],
};
