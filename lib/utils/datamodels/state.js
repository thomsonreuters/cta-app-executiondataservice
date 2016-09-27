'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const keys = {
  id: { type: 'identifier' },
  executionId: { type: 'identifier' },
  status: { type: 'string' },
  timestamp: { type: 'number', optional: true },
  ip: { type: 'string', optional: true },
  hostname: { type: 'string', optional: true },
  index: { type: 'number', optional: true },
};
/**
 * State Data Model class
 *
 * @property {ObjectID} id - unique identifier
 * @property {ObjectID} scenario - unique identifier of a Scenario
 * @property {ObjectID} configuration - unique identifier of a Configuration
 * @property {ObjectID} user - unique identifier of an User
 */
class State {
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
    this.executionId = data.executionId;
    this.timestamp = data.timestamp;
    this.status = data.status;
    this.ip = data.ip;
    this.hostname = data.hostname;
    this.index = data.index;
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

module.exports = State;
