'use strict';
const ObjectID = require('bson').ObjectID;

const properties = {
  id: 'string',
  executionId: 'string',
  scenarioId: 'string',
  configurationId: 'string',
  testsuiteId: 'string',
  testId: 'string',
  timestamp: 'number',
  parent: 'string',
  status: 'string',
  ip: 'string',
  hostname: 'string',
  type: 'string',
  name: 'string',
  description: 'string',
  custom: 'object',
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

  static validate(data) {
    return { ok: 1 };
  }
}

module.exports = Status;
