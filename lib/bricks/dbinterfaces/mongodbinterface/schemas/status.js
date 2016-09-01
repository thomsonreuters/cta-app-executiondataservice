'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');
const Status = require('../../../../utils/datamodels/status.js');
/**
 * Status Schema for MongoDB class
 *
 */
class StatusSchema {
  /**
   *
   * @param {Status} status - params
   */
  constructor(status) {
    const keys = Status.keys();
    const schema = _.pick(status, Object.keys(keys));
    Object.keys(schema).forEach(function(key) {
      if (keys[key].type === 'objectid') {
        schema[key] = new ObjectID(status[key]);
      }
    });
    if ('id' in schema) {
      schema._id = schema.id;
      delete schema.id;
    }
    return schema;
  }

  static toCTAData(mongodbDoc) {
    const keys = Status.keys();
    const statusData = _.pick(mongodbDoc, Object.keys(keys));
    Object.keys(statusData).forEach(function(key) {
      if (keys[key].type === 'objectid') {
        statusData[key] = mongodbDoc[key].toString();
      }
    });
    if ('_id' in mongodbDoc) {
      statusData.id = mongodbDoc._id.toString();
    }
    return new Status(statusData);
  }

  static dataQueryKeys() {
    return Status.queryKeys();
  }
}

module.exports = StatusSchema;
