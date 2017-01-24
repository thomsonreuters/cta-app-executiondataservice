'use strict';

module.exports = {
  name: 'states-businesslogic',
  module: './bricks/businesslogics/states/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
  properties: {
    instancesQueue: 'cta.ids.instances',
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
            type: 'states',
            quality: 'create',
          },
        },
        {
          nature: {
            type: 'states',
            quality: 'findById',
          },
        },
        {
          nature: {
            type: 'states',
            quality: 'update',
          },
        },
        {
          nature: {
            type: 'states',
            quality: 'delete',
          },
        },
        {
          nature: {
            type: 'states',
            quality: 'find',
          },
        },
      ],
    },
  ],
};
