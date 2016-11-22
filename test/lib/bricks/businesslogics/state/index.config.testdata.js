'use strict';

const config = {
  name: 'base-businesslogic',
  module: './bricks/businesslogics/state/index.js',
  properties: {
    instancesQueue: 'cta.ids',
  },
  publish: [],
  subscribe: [
    {
      topic: 'bl.base',
      data: [
        {},
      ],
    },
  ],
};

module.exports = config;
