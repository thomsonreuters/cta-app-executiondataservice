/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

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
          host: 'localhost',
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
