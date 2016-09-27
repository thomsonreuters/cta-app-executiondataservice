'use strict';
const ObjectID = require('bson').ObjectID;

const data = {
  id: (new ObjectID()).toString(),
  executionId: (new ObjectID()).toString(),
  scenarioId: (new ObjectID()).toString(),
  configurationId: (new ObjectID()).toString(),
  testsuiteId: (new ObjectID()).toString(),
  testId: (new ObjectID()).toString(),
  // timestamp: { type: 'number', optional: true },
  // parent: { type: 'objectid', optional: true },
  status: 'pending',
  // ip: { type: 'string', optional: true },
  // hostname: { type: 'string', optional: true },
  // type: { type: 'string', optional: true },
  // name: { type: 'string', optional: true },
  // description: { type: 'string', optional: true },
  // custom: { type: 'object', optional: true },
};

module.exports = data;
