/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const BaseDBInterface = require('../basedbinterface');
const CountHelper = require('./helpers/count');
const DeleteOneHelper = require('./helpers/deleteone');
const Find = require('./helpers/find');
const FindByIdHelper = require('./helpers/findbyid');
const InsertOneHelper = require('./helpers/insertone');
const UpdateOneHelper = require('./helpers/updateone');
const GetInstancesStates = require('./helpers/getinstancesstates');
const GetResultsCountHelper = require('./helpers/getresultscount');
const GetResultsIndexHelper = require('./helpers/getresultsindex');
const GetStatesCountHelper = require('./helpers/getstatescount');
const GetStatesIndexHelper = require('./helpers/getstatesindex');

/**
 * Database Interface MongoDB class
 *
 * @augments BaseDBInterface
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {BrickConfig} configuration - cement configuration of the brick
 * @property {Map<String, Helper>} helpers - Map of Helpers
 */
class MongoDBInterface extends BaseDBInterface {
  constructor(cementHelper, configuration) {
    super(cementHelper, configuration);
    this.helpers.set('count', new CountHelper(this.cementHelper, this.logger));
    this.helpers.set('deleteOne', new DeleteOneHelper(this.cementHelper, this.logger));
    this.helpers.set('find', new Find(this.cementHelper, this.logger));
    this.helpers.set('findById', new FindByIdHelper(this.cementHelper, this.logger));
    this.helpers.set('insertOne', new InsertOneHelper(this.cementHelper, this.logger));
    this.helpers.set('updateOne', new UpdateOneHelper(this.cementHelper, this.logger));
    this.helpers.set('getInstancesStates',
      new GetInstancesStates(this.cementHelper, this.logger));
    this.helpers.set('getResultsCount',
      new GetResultsCountHelper(this.cementHelper, this.logger));
    this.helpers.set('getResultsIndex',
      new GetResultsIndexHelper(this.cementHelper, this.logger));
    this.helpers.set('getStatesCount',
      new GetStatesCountHelper(this.cementHelper, this.logger));
    this.helpers.set('getStatesIndex',
      new GetStatesIndexHelper(this.cementHelper, this.logger));
  }
}

module.exports = MongoDBInterface;
