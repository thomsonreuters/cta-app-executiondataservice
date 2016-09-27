'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const keys = {
  id: { type: 'identifier' },
  // references to other objects
  scenarioId: { type: 'identifier' },
  userId: { type: 'identifier' },
  // timestamps related fields
  startTimestamp: { type: 'number', optional: true },
  updateTimestamp: { type: 'number', optional: true },
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
  completed: { type: 'boolean', optional: true },
};
/**
 * Execution Data Model class
 *
 * @property {ObjectID} id - unique identifier
 * @property {ObjectID} scenario - unique identifier of a Scenario
 * @property {ObjectID} configuration - unique identifier of a Configuration
 * @property {ObjectID} user - unique identifier of an User
 */
class Execution {
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
    this.userId = data.userId;
    this.startTimestamp = data.startTimestamp;
    this.updateTimestamp = data.updateTimestamp;
    this.result = data.result;
    this.ok = data.ok || 0;
    this.partial = data.partial || 0;
    this.inconclusive = data.inconclusive || 0;
    this.failed = data.failed || 0;
    this.resultsCount = data.resultsCount || 0;
    this.instances = data.instances;
    this.commandsCount = data.commandsCount;
    this.state = data.state;
    this.cancelDetails = data.cancelDetails;
    this.completed = data.completed || false;
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
          case 'boolean':
            converted[key] = (query[key].toLowerCase() === 'true');
            break;
          default:
            converted[key] = query[key];
        }
      }
    });
    return converted;
  }
}

module.exports = Execution;
