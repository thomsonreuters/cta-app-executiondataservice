'use strict';
const ObjectID = require('bson').ObjectID;

const data = {
  executionId: (new ObjectID()).toString(),
  // scenarioId: (new ObjectID()).toString(),
  // configurationId: 'string',
  // testsuiteId: 'string',
  testId: (new ObjectID()).toString(),
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

module.exports = data;
