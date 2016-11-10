'use strict';
const nodeUrl = require('url');
const BaseHelper = require('../../base/basehelper.js');
const Execution = require('../../../../utils/datamodels/execution.js');
const validate = require('cta-common').validate;

/**
 * Business Logic Execution Helper Create class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Create extends BaseHelper {
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
   * Validates Execution Model fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) {
    return new Promise((resolve, reject) => {
      const pattern = {
        type: 'object',
        items: Execution.keys(),
      };
      pattern.items.id.optional = true;
      const validation = validate(context.data.payload, pattern);

      if (!validation.isValid) {
        const resultsKeysArray = Object.keys(validation.results);
        if (typeof validation.results === 'object'
          && resultsKeysArray.length > 0) {
          for (let i = 0; i < resultsKeysArray.length; i++) {
            const key = resultsKeysArray[i];
            if (!validation.results[key].isValid) {
              const error = validation.results[key].error;
              reject(new Error(`incorrect '${key}' in job payload: ${error}`));
              break;
            }
          }
        } else {
          reject(new Error('missing/incorrect \'payload\' Object in job'));
        }
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
    const execution = new Execution(context.data.payload);
    const insertExecutionJob = {
      nature: {
        type: 'dbInterface',
        quality: 'insertOne',
      },
      payload: {
        type: 'execution',
        content: execution,
      },
    };
    const insertExecutionContext = this.cementHelper.createContext(insertExecutionJob);
    insertExecutionContext.on('done', function(brickname, insertedExecution) {
      that._onInsertExecution(context, execution, insertedExecution);
    });
    insertExecutionContext.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    insertExecutionContext.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
    insertExecutionContext.publish();
  }

  _onInsertExecution(context, insertedExecution) {
    const that = this;
    const pendingTimestamp =
      insertedExecution.requestTimestamp + insertedExecution.pendingTimeout;
    const createScheduleJob = {
      nature: {
        type: 'request',
        quality: 'post',
      },
      payload: {
        url: nodeUrl.resolve(that.schedulerApiUrl, '/schedules'),
        body: {
          // type: 'execution',
          // objId: insertedExecution.id,
          schedule: pendingTimestamp,
          rest: {
            url: nodeUrl.resolve(that.executionApiUrl,
              `/executions/${insertedExecution.id}/actions`),
            method: 'POST',
            headers: {},
            body: {
              action: 'timeout',
            },
          },
          enabled: true,
        },
      },
    };
    const createScheduleContext = this.cementHelper.createContext(createScheduleJob);
    createScheduleContext.on('done', function(reqBrickName, response) {
      that._onCreateSchedule(context, insertedExecution, response);
    });
    createScheduleContext.on('reject', function(reqBrickName, error) {
      context.emit('reject', reqBrickName, error);
    });
    createScheduleContext.on('error', function(reqBrickName, error) {
      context.emit('error', reqBrickName, error);
    });
    createScheduleContext.publish();
  }

  _onCreateSchedule(context, execution, scheduleResponse) {
    const that = this;
    const schedule = scheduleResponse.data;
    const updateExecutionJob = {
      nature: {
        type: 'dbInterface',
        quality: 'updateOne',
      },
      payload: {
        type: 'execution',
        id: execution.id,
        content: {
          pendingTimeoutScheduleId: schedule.id,
        },
      },
    };
    const updateExecutionContext = this.cementHelper.createContext(updateExecutionJob);
    updateExecutionContext.publish();
    updateExecutionContext.on('done', function(updateBrickName, updatedExecution) {
      context.emit('done', that.cementHelper.brickName, updatedExecution);
    });
    updateExecutionContext.on('reject', function(updateBrickName, error) {
      context.emit('reject', updateBrickName, error);
    });
    updateExecutionContext.on('error', function(updateBrickName, error) {
      context.emit('error', updateBrickName, error);
    });
  }
}

module.exports = Create;
