'use strict';
const nodeUrl = require('url');
const _ = require('lodash');
const BaseHelper = require('../../base/basehelper.js');
const validate = require('cta-common').validate;

/**
 * Business Logic Execution Helper Cancel class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Complete extends BaseHelper {
  constructor(cementHelper, logger, apiURLs) {
    super(cementHelper, logger);

    if (!validate(apiURLs.scenarioApiUrl, { type: 'string' }).isValid) {
      throw (new Error(
        'missing/incorrect \'scenarioApiUrl\' string in application global properties'
      ));
    }
    this.scenarioApiUrl = apiURLs.scenarioApiUrl;
  }

  /**
   * Validates Context properties specific to this Helper
   * Validates Query Execution Model fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) {
    const job = context.data;
    return new Promise((resolve, reject) => {
      if (!validate(job.payload.id, { type: 'identifier' }).isValid) {
        reject(new Error('missing/incorrect \'id\' String value of ObjectID in job payload'));
      }
      resolve({ ok: 1 });
    });
  }

  /**
   * Process the context
   * @param {Context} context - a Context
   */
  _process(context) {
    const that = this;
    const execution = context.data.payload.content;
    that._onGetScenario(context, execution);
  }

  _onGetScenario(context, execution) {
    const that = this;

    const requestScenario = {
      nature: {
        type: 'request',
        quality: 'get',
      },
      payload: {
        url: nodeUrl.resolve(
          that.scenarioApiUrl, `scenarios/${execution.scenarioId}`),
      },
    };
    const requestScenarioContext = this.cementHelper.createContext(requestScenario);
    requestScenarioContext.on('done', function(brickName, reqResponse) {
      context.emit('done', that.cementHelper.brickName, reqResponse.data.afterHandlers);
    });
    requestScenarioContext.on('reject', function(brickName, error) {
      context.emit('reject', brickName, error);
    });
    requestScenarioContext.on('error', function(brickName, error) {
      context.emit('error', brickName, error);
    });
    requestScenarioContext.publish();
  }
}

module.exports = Complete;
