'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const keys = {
  id: { type: 'objectid' },
  executionId: { type: 'objectid' },
  scenarioId: { type: 'objectid' },
  configurationId: { type: 'objectid' },
  testsuiteId: { type: 'objectid' },
  testId: { type: 'objectid' },
  timestamp: { type: 'number', optional: true },
  parent: { type: 'objectid', optional: true },
  status: { type: 'string', optional: true },
  ip: { type: 'string', optional: true },
  hostname: { type: 'string', optional: true },
  type: { type: 'string', optional: true },
  name: { type: 'string', optional: true },
  description: { type: 'string', optional: true },
  custom: { type: 'object', optional: true },
};
/**
 * Status Data Model class
 *
 * @property {ObjectID} id - unique identifier
 * @property {ObjectID} scenario - unique identifier of a Scenario
 * @property {ObjectID} configuration - unique identifier of a Configuration
 * @property {ObjectID} user - unique identifier of an User
 */
class Status {
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
    this.scenarioId = data.scenarioId;
    this.configurationId = data.configurationId;
    this.testsuiteId = data.testsuiteId;
    this.testId = data.testId;
    this.timestamp = data.timestamp;
    this.parent = data.parent;
    this.status = data.status;
    this.ip = data.ip;
    this.hostname = data.hostname;
    this.type = data.type;
    this.name = data.name;
    this.description = data.description;
    this.screenshot = data.screenshot;
    this.custom = data.custom;
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
}

module.exports = Status;
