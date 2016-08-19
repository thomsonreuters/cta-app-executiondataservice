'use strict';

const config = {
  name: 'base-databaseinterface',
  module: './bricks/dbinterfaces/mongodbinterface/index.js',
  properties: {},
  publish: [],
  subscribe: [
    {
      topic: 'dbinterface',
      data: [
        {},
      ],
    },
  ],
};

module.exports = config;
