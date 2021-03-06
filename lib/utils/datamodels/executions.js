/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const keys = {
  id: { type: 'identifier' },
  // references to other objects
  scenarioId: { type: 'identifier' },
  scenarioData: { type: 'object' },
  userId: { type: 'identifier' },
  // timestamps related fields
  requestTimestamp: { type: 'number', optional: true },
  updateTimestamp: { type: 'number', optional: true },
  completeTimestamp: { type: 'number', optional: true },
  // timeouts related fields
  pendingTimeout: { type: 'number', optional: true },
  runningTimeout: { type: 'number', optional: true },
  pendingTimeoutScheduleId: { type: 'identifier', optional: true },
  // results related fields
  result: { type: 'string', optional: true },
  ok: { type: 'number', optional: true },
  partial: { type: 'number', optional: true },
  inconclusive: { type: 'number', optional: true },
  failed: { type: 'number', optional: true },
  resultsCount: { type: 'number', optional: true },
  // states related fields
  instances: { type: 'array', optional: true },
  commandsCount: { type: 'number', optional: true },
  state: { type: 'string', optional: true },
  cancelDetails: { type: 'object', optional: true },
};
/**
 * Execution Data Model class
 *
 * @property {ObjectID} id - unique identifier
 * @property {ObjectID} scenario - unique identifier of a Scenario
 * @property {ObjectID} configuration - unique identifier of a Configuration
 * @property {ObjectID} user - unique identifier of an User
 */
class Executions {
  /**
   *
   * @param {Object} data - params
   * @param {ObjectID} data.id - unique identifier
   * @param {ObjectID} data.scenario - unique identifier of a Scenario
   * @param {ObjectID} data.configuration - unique identifier of a Configuration
   * @param {ObjectID} data.user - unique identifier of an User
   */
  constructor(data) {
    this.id = data.id || (new ObjectID()).toString();
    this.scenarioId = data.scenarioId;
    this.scenarioData = data.scenarioData;
    this.userId = data.userId;
    this.requestTimestamp = data.requestTimestamp;
    this.updateTimestamp = data.updateTimestamp;
    this.completeTimestamp = data.completeTimestamp;
    this.pendingTimeout = data.pendingTimeout;
    this.runningTimeout = data.runningTimeout;
    this.pendingTimeoutScheduleId = data.pendingTimeoutScheduleId;
    this.result = data.result;
    this.ok = data.ok || 0;
    this.partial = data.partial || 0;
    this.inconclusive = data.inconclusive || 0;
    this.failed = data.failed || 0;
    this.resultsCount = data.resultsCount || 0;
    this.instances = data.instances;
    this.commandsCount = data.commandsCount;
    this.state = data.state || 'pending';
    this.cancelDetails = data.cancelDetails;
  }

  static keys() {
    return _.cloneDeep(keys);
  }

  static queryKeys() {
    const queryKeys = _.cloneDeep(keys);
    const keysArray = Object.keys(queryKeys);
    keysArray.forEach(function(key) {
      queryKeys[key].optional = true;
    });
    return queryKeys;
  }

  static convertQueryStrings(query) {
    const converted = {};
    const queryArrays = Object.keys(query);
    queryArrays.forEach(function(key) {
      if (keys.hasOwnProperty(key)) {
        switch (keys[key].type) {
          case 'number':
            converted[key] = parseInt(query[key], 10);
            break;
        // case 'boolean':
        //   converted[key] = (query[key].toLowerCase() === 'true');
        //   break;
          default:
            converted[key] = query[key];
        }
      }
    });
    return converted;
  }
}

module.exports = Executions;
