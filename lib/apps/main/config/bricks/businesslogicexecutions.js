'use strict';

module.exports = {
  name: 'businesslogic-executions',
  module: './bricks/businesslogics/executions/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
  properties: {
    executionApiUrl: 'http://localhost:3010/eds/',
    schedulerApiUrl: 'http://localhost:3011/sch/',
    jobManagerApiUrl: 'http://localhost:3012/jms/',
    scenarioApiUrl: 'http://localhost:3005/sds/',
  },
  publish: [
    {
      topic: 'io.message.acknowledge',
      data: [
        {
          nature: {
            type: 'messages',
            quality: 'acknowledge',
          },
        },
      ],
    },
    {
      topic: 'sender.message.produce',
      data: [
        {
          nature: {
            type: 'messages',
            quality: 'produce',
          },
        },
      ],
    },
    {
      topic: 'dbInterface',
      data: [
        {
          nature: {
            type: 'dbInterface',
          },
        },
      ],
    },
    {
      topic: 'bl.executions',
      data: [
        {
          nature: {
            type: 'executions',
            quality: 'finalize',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'complete',
          },
        },
      ],
    },
    {
      topic: 'requests.com',
      data: [
        {
          nature: {
            type: 'request',
            quality: 'exec',
          },
        },
        {
          nature: {
            type: 'request',
            quality: 'get',
          },
        },
        {
          nature: {
            type: 'request',
            quality: 'delete',
          },
        },
        {
          nature: {
            type: 'request',
            quality: 'post',
          },
        },
        {
          nature: {
            type: 'request',
            quality: 'put',
          },
        },
      ],
    },
  ],
  subscribe: [
    {
      topic: 'bl.executions',
      data: [
        {
          nature: {
            type: 'executions',
            quality: 'create',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'findById',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'update',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'delete',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'finalize',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'find',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'cancel',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'timeout',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'updateResult',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'updateState',
          },
        },
        {
          nature: {
            type: 'executions',
            quality: 'complete',
          },
        },
      ],
    },
  ],
};
