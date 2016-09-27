'use strict';
const ObjectID = require('bson').ObjectID;

const data = {
  id: (new ObjectID()).toString(),
  scenarioId: (new ObjectID()).toString(),
  // configuration: (new ObjectID()).toString(),
  userId: (new ObjectID()).toString(),
  starttimestamp: 1000,
  updatetimestamp: 1010,
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
  // nbresults: Long, // sum(ok, partial...)
  // done: Boolean,
  // instances: Array,
};

module.exports = data;
