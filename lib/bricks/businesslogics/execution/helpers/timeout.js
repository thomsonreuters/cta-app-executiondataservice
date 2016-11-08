'use strict';
const nodeUrl = require('url');
const _ = require('lodash');
const BaseHelper = require('../../base/basehelper.js');
const validate = require('cta-common').validate;

/**
 * Business Logic Execution Helper Timeout class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Timeout extends BaseHelper {
  constructor(cementHelper, logger, apiURLs) {
    super(cementHelper, logger);

    if (!validate(apiURLs.executionApiUrl, { type: 'string' }).isValid) {
      throw (new Error(
        'missing/incorrect \'executionApiUrl\' string in application global properties'
      ));
    }
    this.executionApiUrl = apiURLs.executionApiUrl;

    if (!validate(apiURLs.schedulerApiUrl, { type: 'string' }).isValid) {
      throw (new Error(
        'missing/incorrect \'schedulerApiUrl\' string in application global properties'
      ));
    }
    this.schedulerApiUrl = apiURLs.schedulerApiUrl;

    if (!validate(apiURLs.jobManagerApiUrl, { type: 'string' }).isValid) {
      throw (new Error(
        'missing/incorrect \'jobManagerApiUrl\' string in application global properties'
      ));
    }
    this.jobManagerApiUrl = apiURLs.jobManagerApiUrl;
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
    const findJob = {
      nature: {
        type: 'dbInterface',
        quality: 'findById',
      },
      payload: {
        type: 'execution',
        id: context.data.payload.id,
      },
    };
    const findContext = this.cementHelper.createContext(findJob);
    findContext.on('done', function(brickname, execution) {
      if (!execution) {
        context.emit('not-found', that.cementHelper.brickName);
      } else {
        const instances = _.map(execution.instances, function(instance) {
          return _.pick(instance, ['hostname']);
        });
        const requestJob = {
          nature: {
            type: 'request',
            quality: 'post',
          },
          payload: {
            url: nodeUrl.resolve(
              that.jobManagerApiUrl, `jobmanager/executions/${execution.id}/actions`),
            body: {
              action: 'timeout',
              instances: instances,
            },
          },
        };
        const requestContext = this.cementHelper.createContext(requestJob);
        requestContext.on('done', function(reqBrickName, reqResponse) {
          // todo: should generate a new State timeout for the Execution

          context.emit('done', that.cementHelper.brickName, reqResponse);
        });
        requestContext.on('reject', function(reqBrickName, error) {
          context.emit('reject', reqBrickName, error);
        });
        requestContext.on('error', function(reqBrickName, error) {
          context.emit('error', reqBrickName, error);
        });
        requestContext.publish();
      }
    });
    findContext.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    findContext.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
    findContext.publish();
  }
}

module.exports = Timeout;
