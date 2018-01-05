/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');
const State = require('../../../../utils/datamodels/states.js');
/**
 * State Schema for MongoDB class
 *
 */
class StateSchema {
  /**
   *
   * @param {State} state - params
   */
  constructor(state) {
    const keys = State.keys();
    const schema = _.pick(state, Object.keys(keys));
    Object.keys(schema).forEach(function(key) {
      if (keys[key].type === 'identifier') {
        schema[key] = new ObjectID(state[key]);
      }
    });
    if ('id' in schema) {
      schema._id = schema.id;
      delete schema.id;
    }
    return schema;
  }

  static toCTAData(mongodbDoc) {
    const keys = State.keys();
    const stateData = _.pick(mongodbDoc, Object.keys(keys));
    Object.keys(stateData).forEach(function(key) {
      if (keys[key].type === 'identifier') {
        stateData[key] = mongodbDoc[key].toString();
      }
    });
    if ('_id' in mongodbDoc) {
      stateData.id = mongodbDoc._id.toString();
    }
    return new State(stateData);
  }

  static dataQueryKeys() {
    return State.queryKeys();
  }
}

module.exports = StateSchema;
