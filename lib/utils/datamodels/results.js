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
  executionId: { type: 'identifier' },
  // scenarioId: { type: 'identifier' },
  // configurationId: { type: 'identifier' },
  // testsuiteId: { type: 'identifier' },
  testId: [
    { type: 'identifier' },
    { type: 'string' },
  ],
  // parentId: { type: 'identifier', optional: true },
  testName: { type: 'string', optional: true },
  testDescription: { type: 'string', optional: true },
  status: { type: 'string' },
  index: { type: 'number', optional: true },
  timestamp: { type: 'number', optional: true },
  ip: { type: 'string', optional: true },
  hostname: { type: 'string', optional: true },
  type: { type: 'string', optional: true },
  name: { type: 'string', optional: true },
  description: { type: 'string', optional: true },
  screenshot: { type: 'string', optional: true },
  attachment: { type: 'string', optional: true },
  build: { type: 'string', optional: true },
  custom: { type: 'object', optional: true },
};
/**
 * Result Data Model class
 *
 * @property {ObjectID} id - unique identifier
 * @property {ObjectID} scenario - unique identifier of a Scenario
 * @property {ObjectID} configuration - unique identifier of a Configuration
 * @property {ObjectID} user - unique identifier of an User
 */
class Results {
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
    // this.scenarioId = data.scenarioId;
    // this.configurationId = data.configurationId;
    // this.testsuiteId = data.testsuiteId;
    this.testId = data.testId;
    this.testName = data.testName;
    this.testDescription = data.testDescription;
    this.timestamp = data.timestamp;
    // this.parentId = data.parentId;
    this.status = data.status;
    this.index = data.index;
    this.ip = data.ip;
    this.hostname = data.hostname;
    this.type = data.type;
    this.name = data.name;
    this.description = data.description;
    this.screenshot = data.screenshot;
    this.attachment = data.attachment;
    this.build = data.build;
    this.custom = data.custom;
  }

  static keys() {
    return _.cloneDeep(keys);
  }

  static queryKeys() {
    const queryKeys = _.cloneDeep(keys);
    const keysArray = Object.keys(queryKeys);
    keysArray.forEach(function(key) {
      if (Array.isArray(queryKeys[key])) {
        queryKeys[key].forEach(function(type) {
          type.optional = true; // eslint-disable-line no-param-reassign
        });
      } else {
        queryKeys[key].optional = true;
      }
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

module.exports = Results;
