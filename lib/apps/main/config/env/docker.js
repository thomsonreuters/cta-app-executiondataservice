/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

module.exports = {
  properties: {
    executionApiUrl: 'http://eds:3010/',
    schedulerApiUrl: 'http://sds:3011/',
    jobManagerApiUrl: 'http://jobmanager:3012/',
  },
  tools: [
    {
      name: 'messaging',
      properties: {
        parameters: {
          url: 'amqp://rabbitmq:rabbitmq@rabbitmq?heartbeat=60',
        },
      },
    },
  ],
  bricks: [
    {
      name: 'dblayer-mongodb',
      properties: {
        configuration: {
          servers: [
            {
              host: 'mongo',
              port: 27017,
            },
          ],
        },
      },
    },
    {
      name: 'businesslogic-executions',
      properties: {
        executionApiUrl: 'http://eds:3010/',
        schedulerApiUrl: 'http://sds:3011/',
        jobManagerApiUrl: 'http://jobmanager:3012/',
      },
    },
  ],
};
