'use strict';
const ObjectID = require('bson').ObjectID;

const data = {
  scenarioId: (new ObjectID()).toString(),
  // configuration: (new ObjectID()).toString(),
  userId: (new ObjectID()).toString(),
  requestTimestamp: Date.now,
  updateTimestamp: Date.now,
  commandsCount: 1,
  state: 'pending', // pending,running,acked, cancelled, finished
  // cancel: {
  //   mode: String,
  //   user: {
  //     first: String,
  //     last: String,
  //   },
  // },
  // result: String, // succeeded, inconclusive, partial, failed
  // ok: Long,
  // partial: Long,
  // inconclusive: Long,
  // failed: Long,
  // resultsCount: Long, // sum(ok, partial...)
  // done: Boolean,
  // instances: Array,
};

module.exports = data;
