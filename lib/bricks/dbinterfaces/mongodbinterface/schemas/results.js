/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');
const Result = require('../../../../utils/datamodels/results.js');
/**
 * Result Schema for MongoDB class
 *
 */
class ResultSchema {
  /**
   *
   * @param {Result} result - params
   */
  constructor(result) {
    const keys = Result.keys();
    const schema = _.pick(result, Object.keys(keys));
    Object.keys(schema).forEach(function(key) {
      if (Array.isArray(keys[key])) {
        const canBeIdentifier = keys[key].some(
          (keyType) => keyType.type === 'identifier'
        );
        if (canBeIdentifier && ObjectID.isValid(result[key])) {
          schema[key] = new ObjectID(result[key]);
        }
      } else if (keys[key].type === 'identifier') {
        schema[key] = new ObjectID(result[key]);
      }
    });
    if ('id' in schema) {
      schema._id = schema.id;
      delete schema.id;
    }
    return schema;
  }

  static toCTAData(mongodbDoc) {
    const keys = Result.keys();
    const resultData = _.pick(mongodbDoc, Object.keys(keys));
    Object.keys(resultData).forEach(function(key) {
      if (Array.isArray(keys[key])) {
        const canBeIdentifier = keys[key].some(
          (keyType) => keyType.type === 'identifier'
        );
        if (canBeIdentifier && ObjectID.isValid(mongodbDoc[key])) {
          resultData[key] = mongodbDoc[key].toString();
        }
      } else if (keys[key].type === 'identifier') {
        resultData[key] = mongodbDoc[key].toString();
      }
    });
    if ('_id' in mongodbDoc) {
      resultData.id = mongodbDoc._id.toString();
    }
    return new Result(resultData);
  }

  static dataQueryKeys() {
    return Result.queryKeys();
  }
}

module.exports = ResultSchema;
