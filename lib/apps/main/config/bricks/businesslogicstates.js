'use strict';

module.exports = {
  name: 'states-businesslogic',
  module: './bricks/businesslogics/state/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
  properties: {
    instancesQueue: 'cta.ids',
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
      topic: 'sender.message.produce',
      data: [
        {
          nature: {
            type: 'message',
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
            type: 'execution',
          },
        },
      ],
    },
  ],
  subscribe: [
    {
      topic: 'bl.states',
      data: [
        {
          nature: {
            type: 'state',
            quality: 'create',
          },
        },
        {
          nature: {
            type: 'state',
            quality: 'findById',
          },
        },
        {
          nature: {
            type: 'state',
            quality: 'update',
          },
        },
        {
          nature: {
            type: 'state',
            quality: 'delete',
          },
        },
        {
          nature: {
            type: 'state',
            quality: 'find',
          },
        },
      ],
    },
  ],
};
