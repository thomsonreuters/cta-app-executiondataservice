'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const keys = {
  id: { type: 'objectid' },
  scenarioId: { type: 'objectid' },
  userId: { type: 'objectid' },
  starttimestamp: { type: 'number', optional: true },
  updatetimestamp: { type: 'number', optional: true },
  state: { type: 'string', optional: true },
  cancel: { type: 'object', optional: true },
  status: { type: 'string', optional: true },
  ok: { type: 'number', optional: true },
  partial: { type: 'number', optional: true },
  inconclusive: { type: 'number', optional: true },
  failed: { type: 'number', optional: true },
  nbstatuses: { type: 'number', optional: true },
  done: { type: 'boolean', optional: true },
  instances: { type: 'array', optional: true },
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
    this.starttimestamp = data.starttimestamp;
    this.updatetimestamp = data.updatetimestamp;
    this.state = data.state;
    this.cancel = data.cancel;
    this.status = data.status;
    this.ok = data.ok;
    this.partial = data.partial;
    this.inconclusive = data.inconclusive;
    this.failed = data.failed;
    this.nbstatuses = data.nbstatuses;
    this.done = data.done;
    this.instances = data.instances;
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
