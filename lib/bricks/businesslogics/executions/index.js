'use strict';

const Base = require('../base');
const CancelHelper = require('./helpers/cancel');
const CreateHelper = require('./helpers/create');
const DeleteHelper = require('./helpers/delete');
const Finalize = require('./helpers/finalize');
const Find = require('./helpers/find');
const FindByIdHelper = require('./helpers/findbyid');
const TimeoutHelper = require('./helpers/timeout');
const UpdateHelper = require('./helpers/update');
const UpdateResultHelper = require('./helpers/updateresult');
const UpdateStateHelper = require('./helpers/updatestate');
const CompleteHelper = require('./helpers/complete');

/**
 * Business Logic Execution class
 *
 * @augments Base
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {BrickConfig} configuration - cement configuration of the brick
 * @property {Object} apiURLs - list of URLs to other components APIs
 * @property {Map<String, Helper>} helpers - Map of Helpers
 */
class Executions extends Base {
  constructor(cementHelper, configuration) {
    super(cementHelper, configuration);

    this.apiURLs = {};
    this.apiURLs.executionApiUrl =
      configuration.properties.executionApiUrl || cementHelper.appProperties.executionApiUrl;
    this.apiURLs.schedulerApiUrl =
      configuration.properties.schedulerApiUrl || cementHelper.appProperties.schedulerApiUrl;
    this.apiURLs.jobManagerApiUrl =
      configuration.properties.jobManagerApiUrl || cementHelper.appProperties.jobManagerApiUrl;
    this.apiURLs.scenarioApiUrl =
      configuration.properties.scenarioApiUrl || cementHelper.appProperties.scenarioApiUrl;


    this.helpers.set('cancel',
      new CancelHelper(this.cementHelper, this.logger, this.apiURLs));
    this.helpers.set('create',
      new CreateHelper(this.cementHelper, this.logger, this.apiURLs));
    this.helpers.set('delete', new DeleteHelper(this.cementHelper, this.logger));
    this.helpers.set('finalize', new Finalize(this.cementHelper, this.logger));
    this.helpers.set('find', new Find(this.cementHelper, this.logger));
    this.helpers.set('findById', new FindByIdHelper(this.cementHelper, this.logger));
    this.helpers.set('timeout',
      new TimeoutHelper(this.cementHelper, this.logger, this.apiURLs));
    this.helpers.set('update', new UpdateHelper(this.cementHelper, this.logger));
    this.helpers.set('updateState',
      new UpdateStateHelper(this.cementHelper, this.logger, this.apiURLs));
    this.helpers.set('updateResult',
      new UpdateResultHelper(this.cementHelper, this.logger));
    this.helpers.set('complete', new CompleteHelper(this.cementHelper, this.logger, this.apiURLs));
  }
}

module.exports = Executions;
