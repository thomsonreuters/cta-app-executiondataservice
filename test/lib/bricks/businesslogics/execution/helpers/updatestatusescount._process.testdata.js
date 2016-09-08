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
  nbstatuses: 3,
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
const updatedExecutionFields = {
  failed: 0,
  partial: 0,
  inconclusive: 0,
  ok: 0,
  nbstatuses: 0,
  updatetimestamp: Date.now,
  status: '',
};
statuses.forEach(function(status) {
  statusesCount[status.status]++;
  updatedExecutionFields[status.status]++;
  updatedExecutionFields.nbstatuses++;
});
if (updatedExecutionFields.failed > 0) {
  updatedExecutionFields.status = 'failed';
} else if (updatedExecutionFields.partial > 0) {
  updatedExecutionFields.status = 'partial';
} else if (updatedExecutionFields.inconclusive > 0) {
  updatedExecutionFields.status = 'inconclusive';
} else if (updatedExecutionFields.ok > 0) {
  updatedExecutionFields.status = 'ok';
} else {
  updatedExecutionFields.status = 'failed';
}

const response = {
  statusesCount: [
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
  ],
  totalCount: statuses.length,
};


module.exports = {
  job: DEFAULTINPUTJOB,
  execution: execution,
  statuses: statuses,
  statusesCount: statusesCount,
  updatedExecutionFields: updatedExecutionFields,
  response: response,
};
