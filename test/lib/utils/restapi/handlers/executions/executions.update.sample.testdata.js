'use strict';
const ObjectID = require('bson').ObjectID;

const execution = {
  scenario: (new ObjectID()).toString(),
  configuration: (new ObjectID()).toString(),
  user: (new ObjectID()).toString(),
  startTimestamp: new Date(),
  updateTimestamp: new Date(),
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
};

module.exports = execution;
