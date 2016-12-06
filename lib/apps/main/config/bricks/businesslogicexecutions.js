'use strict';

module.exports = {
  name: 'businesslogic-executions',
  module: './bricks/businesslogics/execution/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
  properties: {
    executionApiUrl: 'http://localhost:3010/',
    schedulerApiUrl: 'http://localhost:3011/',
    jobManagerApiUrl: 'http://localhost:3012/',
  },
  publish: [
    {
      topic: 'io.message.acknowledge',
      data: [
        {
          nature: {
            type: 'message',
            quality: 'acknowledge',
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
            type: 'execution',
            quality: 'finalize',
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
            type: 'execution',
            quality: 'create',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'findById',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'update',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'delete',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'finalize',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'find',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'cancel',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'timeout',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'updateResult',
          },
        },
        {
          nature: {
            type: 'execution',
            quality: 'updateState',
          },
        },
      ],
    },
  ],
};
