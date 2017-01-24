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
