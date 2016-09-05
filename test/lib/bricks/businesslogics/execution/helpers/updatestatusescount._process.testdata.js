'use strict';
const appRootPath = require('app-root-path').path;
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const Execution = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels/', 'execution.js'));
const Status = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels/', 'status.js'));

const execution = new Execution({
  id: (new ObjectID()).toString(),
});
const DEFAULTINPUTJOB = {
  nature: {
    type: 'execution',
    quality: 'updatestatuses',
  },
  payload: {
    executionId: execution.id,
  },
};

const statuses = [
  new Status({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'failed',
    timestamp: 1000,
  }),
  new Status({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'partial',
    timestamp: 1001,
  }),
  new Status({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'failed',
    timestamp: 1002,
  }),
  new Status({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'failed',
    timestamp: 1003,
  }),
  new Status({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'inconclusive',
    timestamp: 1004,
  }),
  new Status({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'ok',
    timestamp: 1005,
  }),
  new Status({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'partial',
    timestamp: 1006,
  }),
];

const statusesCount = {
  failed: 0,
  partial: 0,
  inconclusive: 0,
  ok: 0,
};
statuses.forEach(function(status) {
  statusesCount[status.status]++;
});
const statusesCountProjection = [
  {
    status: 'failed',
    count: statusesCount.failed,
  },
  {
    status: 'partial',
    count: statusesCount.partial,
  },
  {
    status: 'inconclusive',
    count: statusesCount.inconclusive,
  },
  {
    status: 'ok',
    count: statusesCount.ok,
  },
];

module.exports = {
  job: DEFAULTINPUTJOB,
  execution: execution,
  statuses: statuses,
  statusesCount: statusesCount,
  statusesCountProjection: statusesCountProjection,
};
