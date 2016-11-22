'use strict';
module.exports = {
  name: 'sender',
  module: 'cta-io',
  dependencies: {
    messaging: 'messaging',
  },
  properties: {
    output: {
      queue: 'cta.ids',
    },
  },
  publish: [
    {
      topic: 'silo',
      data: [
        {
          nature: {
            type: 'document',
            quality: 'backup',
          },
        },
        {
          nature: {
            type: 'document',
            quality: 'restore',
          },
        },
      ],
    },
  ],
  subscribe: [
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
  ],
};
