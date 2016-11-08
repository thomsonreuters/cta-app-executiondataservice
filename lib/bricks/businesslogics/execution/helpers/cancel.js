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
class Cancel extends BaseHelper {
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
      that._onFindExecution(context, execution);
    });
    findContext.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    findContext.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
    findContext.publish();
  }

  _onFindExecution(context, execution) {
    const that = this;
    if (!execution) {
      context.emit('not-found', that.cementHelper.brickName);
    } else {
      const getInstancesStatesJob = {
        nature: {
          type: 'dbInterface',
          quality: 'getInstancesStates',
        },
        payload: {
          query: {
            executionId: context.data.payload.id,
          },
        },
      };
      const getInstancesStatesContext =
        this.cementHelper.createContext(getInstancesStatesJob);
      getInstancesStatesContext.publish();
      getInstancesStatesContext.on('done', function (brickName, aggregate) {
        that._onGetInstancesStates(context, execution, aggregate);
      });
      getInstancesStatesContext.on('reject', function (brickName, error) {
        context.emit('reject', brickName, error);
      });
      getInstancesStatesContext.on('error', function (brickName, error) {
        context.emit('error', brickName, error);
      });
    }
  }

  _onGetInstancesStates(context, execution, aggregate) {
    const that = this;
    const instances = [];
    execution.instances.forEach(function(instance) {
      const i = _.pick(instance, ['hostname']);
      const instanceState = aggregate.find((state) => state.hostname === i.hostname);
      i.state = (instanceState !== undefined) ? instanceState.state : 'pending';
      instances.push(i);
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
          action: 'cancel',
          instances: instances,
        },
      },
    };
    const requestContext = this.cementHelper.createContext(requestJob);
    requestContext.on('done', function(brickName, reqResponse) {
      // todo: if execution.state === 'pending'
      // should generate a new State canceled for the Execution

      context.emit('done', that.cementHelper.brickName, reqResponse);
    });
    requestContext.on('reject', function(brickName, error) {
      context.emit('reject', brickName, error);
    });
    requestContext.on('error', function(brickName, error) {
      context.emit('error', brickName, error);
    });
    requestContext.publish();
  }
}

module.exports = Cancel;
