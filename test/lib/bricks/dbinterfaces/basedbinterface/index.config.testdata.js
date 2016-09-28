'use strict';

const config = {
  name: 'base-databaseinterface',
  module: './bricks/dbinterfaces/basedbinterface/index.js',
  properties: {},
  publish: [],
  subscribe: [
    {
      topic: 'dbInterface',
      data: [
        {},
      ],
    },
  ],
};

module.exports = config;
