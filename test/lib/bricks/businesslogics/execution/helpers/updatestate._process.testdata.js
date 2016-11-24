'use strict';
const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');
const Execution = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels/', 'execution.js'));
const State = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels/', 'state.js'));

const execution = new Execution({
  id: (new ObjectID()).toString(),
  commandsCount: 1,
  completeTimestamp: null,
  state: 'pending',
  instances: [
    {
      hostname: 'machine1',
    },
    {
      hostname: 'machine2',
    },
  ],
});
const DEFAULTINPUTJOB = {
  nature: {
    type: 'execution',
    quality: 'updateState',
  },
  payload: {
    executionId: execution.id,
  },
};

const states = [
  new State({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    status: 'pending',
    timestamp: 1000,
  }),
  new State({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    status: 'running',
    timestamp: 1001,
  }),
  new State({
    id: (new ObjectID()).toString(),
    executionId: execution.id,
    status: 'finished',
    timestamp: 1002,
  }),
];

const statesCount = {
  pending: 0,
  running: 0,
  acked: 0,
  finished: 0,
  canceled: 0,
};
states.forEach(function(state) {
  statesCount[state.status]++;
});
const response = statesCount;

const updatedExecutionFields = {
  state: 'finished',
  updateTimestamp: Date.now,
};

const updatedExecution = _.cloneDeep(execution);
updatedExecution.state = updatedExecutionFields.state;
updatedExecution.updateTimestamp = updatedExecutionFields.updateTimestamp;
updatedExecution.pendingTimeoutScheduleId = (new ObjectID()).toString();

const instancesStates = _.cloneDeep(execution.instances);
instancesStates.forEach(function(instancesState) {
  instancesState.state = 'running'; // eslint-disable-line no-param-reassign
});

module.exports = {
  job: DEFAULTINPUTJOB,
  execution: execution,
  states: states,
  statesCount: statesCount,
  response: response,
  updatedExecutionFields: updatedExecutionFields,
  updatedExecution: updatedExecution,
  instancesStates: instancesStates,
};
