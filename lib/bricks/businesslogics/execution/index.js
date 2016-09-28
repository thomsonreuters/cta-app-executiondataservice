'use strict';

const Base = require('../base');
const CreateHelper = require('./helpers/create');
const DeleteHelper = require('./helpers/delete');
const Finalize = require('./helpers/finalize');
const Find = require('./helpers/find');
const FindByIdHelper = require('./helpers/findbyid');
const UpdateHelper = require('./helpers/update');
const UpdateResultHelper = require('./helpers/updateresult');
const UpdateStateHelper = require('./helpers/updatestate');

/**
 * Business Logic Execution class
 *
 * @augments Base
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {BrickConfig} configuration - cement configuration of the brick
 * @property {Map<String, Helper>} helpers - Map of Helpers
 */
class Execution extends Base {
  constructor(cementHelper, configuration) {
    super(cementHelper, configuration);
    this.helpers.set('create', new CreateHelper(this.cementHelper, this.logger));
    this.helpers.set('delete', new DeleteHelper(this.cementHelper, this.logger));
    this.helpers.set('finalize', new Finalize(this.cementHelper, this.logger));
    this.helpers.set('find', new Find(this.cementHelper, this.logger));
    this.helpers.set('findById', new FindByIdHelper(this.cementHelper, this.logger));
    this.helpers.set('update', new UpdateHelper(this.cementHelper, this.logger));
    this.helpers.set('updateState', new UpdateStateHelper(this.cementHelper, this.logger));
    this.helpers.set('updateResult',
      new UpdateResultHelper(this.cementHelper, this.logger));
  }
}

module.exports = Execution;
