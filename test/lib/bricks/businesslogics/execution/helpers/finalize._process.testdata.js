'use strict';
const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const Execution = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels/', 'execution.js'));

const execution = new Execution({
  id: (new ObjectID()).toString(),
  resultsCount: 3,
  state: 'finished',
});
const DEFAULTINPUTJOB = {
  nature: {
    type: 'execution',
    quality: 'finalize',
  },
  payload: {
    executionId: execution.id,
  },
};

const noGapResultsIndexes = {
  machine1: {
    idxcount: 6,
    minidx: 1,
    maxidx: 6,
  },
  machine2: {
    idxcount: 3,
    minidx: 1,
    maxidx: 3,
  },
};

const gapResultsIndexes = {
  machine1: {
    idxcount: 5,
    minidx: 1,
    maxidx: 6,
  },
  machine2: {
    idxcount: 3,
    minidx: 1,
    maxidx: 3,
  },
};

const noGapStatesIndexes = {
  machine1: {
    maxidx: 6,
  },
  machine2: {
    maxidx: 3,
  },
  machine3: {
    maxidx: 0,
  },
};

const gapStatesIndexes = {
  machine1: {
    maxidx: 5,
  },
  machine2: {
    maxidx: 3,
  },
  machine3: {
    maxidx: 0,
  },
};

const updatedExecutionFields = {
  completeTimestamp: Date.now(),
};

module.exports = {
  job: DEFAULTINPUTJOB,
  execution: execution,
  noGapResultsIndexes: noGapResultsIndexes,
  gapResultsIndexes: gapResultsIndexes,
  noGapStatesIndexes: noGapStatesIndexes,
  gapStatesIndexes: gapStatesIndexes,
  updatedExecutionFields: updatedExecutionFields,
};
