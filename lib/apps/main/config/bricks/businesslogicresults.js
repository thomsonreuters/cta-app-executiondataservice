'use strict';

module.exports = {
  name: 'results-businesslogic',
  module: './bricks/businesslogics/result/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
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
          },
        },
      ],
    },
  ],
  subscribe: [
    {
      topic: 'bl.results',
      data: [
        {
          nature: {
            type: 'result',
            quality: 'create',
          },
        },
        {
          nature: {
            type: 'result',
            quality: 'findById',
          },
        },
        {
          nature: {
            type: 'result',
            quality: 'update',
          },
        },
        {
          nature: {
            type: 'result',
            quality: 'delete',
          },
        },
        {
          nature: {
            type: 'result',
            quality: 'find',
          },
        },
      ],
    },
  ],
};
