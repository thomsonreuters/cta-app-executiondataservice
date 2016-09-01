'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');
const Execution = require('../../../../utils/datamodels/execution.js');
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
      if (keys[key].type === 'objectid') {
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
      if (keys[key].type === 'objectid') {
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
