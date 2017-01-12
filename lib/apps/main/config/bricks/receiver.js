'use strict';

module.exports = {
  name: 'receiver',
  module: 'cta-io',
  dependencies: {
    messaging: 'messaging',
  },
  properties: {
    input: {
      queue: 'queue.statuses',
    },
  },
  publish: [
    {
      topic: 'bl.results',
      data: [
        {
          nature: {
            type: 'results',
          },
        },
      ],
    },
    {
      topic: 'bl.states',
      data: [
        {
          nature: {
            type: 'states',
          },
        },
      ],
    },
  ],
  subscribe: [
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
  ],
};
