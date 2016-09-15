'use strict';
const ObjectID = require('bson').ObjectID;

const execution = {
  scenario: (new ObjectID()).toString(),
  configuration: (new ObjectID()).toString(),
  user: (new ObjectID()).toString(),
  starttimestamp: new Date(),
  updatetimestamp: new Date(),
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
};

module.exports = execution;
