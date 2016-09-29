'use strict';

module.exports = {
  name: 'executions-businesslogic',
  module: './bricks/businesslogics/execution/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
  properties: {},
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
