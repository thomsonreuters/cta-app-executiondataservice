'use strict';
const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const Execution = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels/', 'execution.js'));
const Result = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels/', 'result.js'));

const execution = new Execution({
  id: (new ObjectID()).toString(),
  resultsCount: 3,
});
const DEFAULTINPUTJOB = {
  nature: {
    type: 'execution',
    quality: 'updateResult',
  },
  payload: {
    executionId: execution.id,
  },
};

const results = [
  new Result({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'failed',
    timestamp: 1000,
  }),
  new Result({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'partial',
    timestamp: 1001,
  }),
  new Result({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'failed',
    timestamp: 1002,
  }),
  new Result({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'failed',
    timestamp: 1003,
  }),
  new Result({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'inconclusive',
    timestamp: 1004,
  }),
  new Result({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'ok',
    timestamp: 1005,
  }),
  new Result({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    testId: (new ObjectID()).toString(),
    status: 'partial',
    timestamp: 1006,
  }),
];

const resultsCount = {
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
  resultsCount: 0,
  updateTimestamp: Date.now,
  result: '',
};
results.forEach(function(result) {
  resultsCount[result.status]++;
  updatedExecutionFields[result.status]++;
  updatedExecutionFields.resultsCount++;
});
if (updatedExecutionFields.failed > 0) {
  updatedExecutionFields.result = 'failed';
} else if (updatedExecutionFields.partial > 0) {
  updatedExecutionFields.result = 'partial';
} else if (updatedExecutionFields.inconclusive > 0) {
  updatedExecutionFields.result = 'inconclusive';
} else if (updatedExecutionFields.ok > 0) {
  updatedExecutionFields.result = 'ok';
} else {
  updatedExecutionFields.result = 'failed';
}


module.exports = {
  job: DEFAULTINPUTJOB,
  execution: execution,
  results: results,
  resultsCount: resultsCount,
  updatedExecutionFields: updatedExecutionFields,
  aggregation: resultsCount,
  count: results.length,
};
