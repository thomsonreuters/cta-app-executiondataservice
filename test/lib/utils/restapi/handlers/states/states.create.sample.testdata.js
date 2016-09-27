'use strict';
const ObjectID = require('bson').ObjectID;

const state = {
  executionId: (new ObjectID()).toString(),
  scenarioId: (new ObjectID()).toString(),
  configurationId: (new ObjectID()).toString(),
  // testsuiteId: 'string',
  // testId: 'string',
  // timestamp: 'number',
  // parent: 'string',
  // status: 'string',
  // ip: 'string',
  // hostname: 'string',
  // type: 'string',
  // name: 'string',
  // description: 'string',
  // custom: 'object',
};

module.exports = state;
