/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');
const Execution = require('../../../../utils/datamodels/executions.js');
/**
 * Execution Schema for MongoDB class
 *
 */
class ExecutionSchema {
  /**
   *
   * @param {Execution} execution - params
   */
  constructor(execution) {
    const keys = Execution.keys();
    const schema = _.pick(execution, Object.keys(keys));
    Object.keys(schema).forEach(function(key) {
      if (keys[key].type === 'identifier') {
        schema[key] = new ObjectID(execution[key]);
      }
    });
    if ('id' in schema) {
      schema._id = schema.id;
      delete schema.id;
    }
    return schema;
  }

  static toCTAData(mongodbDoc) {
    const keys = Execution.keys();
    const executionData = _.pick(mongodbDoc, Object.keys(keys));
    Object.keys(executionData).forEach(function(key) {
      if (keys[key].type === 'identifier') {
        executionData[key] = mongodbDoc[key].toString();
      }
    });
    if ('_id' in mongodbDoc) {
      executionData.id = mongodbDoc._id.toString();
    }
    return new Execution(executionData);
  }

  static dataQueryKeys() {
    return Execution.queryKeys();
  }
}

module.exports = ExecutionSchema;
