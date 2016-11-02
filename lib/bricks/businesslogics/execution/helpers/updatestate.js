'use strict';
const nodeUrl = require('url');
const BaseHelper = require('../../base/basehelper.js');
const validate = require('cta-common').validate;
// const Execution = require('../../../../utils/datamodels/execution.js');
// const _ = require('lodash');

/**
 * Business Logic Execution Helper UpdateState class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class UpdateState extends BaseHelper {
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
    const job = context.data;
    return new Promise((resolve, reject) => {
      if (!validate(job.payload.executionId, { type: 'identifier' }).isValid) {
        reject(new Error('missing/incorrect \'executionId\' identifier in job payload'));
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
    const findExecution = {
      nature: {
        type: 'dbInterface',
        quality: 'findById',
      },
      payload: {
        type: 'execution',
        id: context.data.payload.executionId,
      },
    };
    const findExecutionContext = this.cementHelper.createContext(findExecution);
    findExecutionContext.publish();
    findExecutionContext.on('done', function(brickname, execution) {
      if (execution.completeTimestamp) {
        context.emit('done', that.cementHelper.brickName, execution);
      } else {
        const query = {
          executionId: context.data.payload.executionId,
        };
        const findStates = {
          nature: {
            type: 'dbInterface',
            quality: 'getStatesCount',
          },
          payload: {
            filter: {
              offset: 0,
              sort: {
                timestamp: -1,
              },
            },
            query: query,
          },
        };
        const findStatesContext = this.cementHelper.createContext(findStates);
        findStatesContext.publish();
        findStatesContext.on('done', function(bricknameTwo, states) {
          const updateFields = that._getExecutionUpdatedFields(states, execution.commandsCount);
          const updateExecutionJob = {
            nature: {
              type: 'dbInterface',
              quality: 'updateOne',
            },
            payload: {
              type: 'execution',
              id: execution.id,
              content: updateFields,
            },
          };
          const updateExecutionContext = this.cementHelper.createContext(updateExecutionJob);
          updateExecutionContext.publish();
          updateExecutionContext.on('done', function(bricknameThree, updatedExecution) {
            const isNowNotPending = execution.state === 'pending'
              && updatedExecution.state !== 'pending';
            if (isNowNotPending && updatedExecution.hasOwnProperty('pendingTimeoutScheduleId')) {
              const deleteScheduleJob = {
                nature: {
                  type: 'request',
                  quality: 'delete',
                },
                payload: {
                  url: nodeUrl.resolve(that.schedulerApiUrl,
                    `/schedules/${updatedExecution.pendingTimeoutScheduleId}`),
                  // type: 'execution',
                  // objId: updatedExecution.id,
                },
              };
              const deleteScheduleContext = this.cementHelper.createContext(deleteScheduleJob);
              deleteScheduleContext.publish();
            }

            const finalizeExecutionJob = {
              nature: {
                type: 'execution',
                quality: 'finalize',
              },
              payload: {
                executionId: updatedExecution.id,
              },
            };
            const finalizeExecutionContext = this.cementHelper.createContext(finalizeExecutionJob);
            finalizeExecutionContext.publish();
            finalizeExecutionContext.on('done', function(bricknameFour, finalizedExecution) {
              context.emit('done', that.cementHelper.brickName, finalizedExecution);
            });
            finalizeExecutionContext.on('reject', function(bricknameFour, error) {
              context.emit('reject', bricknameFour, error);
            });
            finalizeExecutionContext.on('error', function(bricknameFour, error) {
              context.emit('error', bricknameFour, error);
            });
          });
          updateExecutionContext.on('reject', function(bricknameThree, error) {
            context.emit('reject', bricknameThree, error);
          });
          updateExecutionContext.on('error', function(bricknameThree, error) {
            context.emit('error', bricknameThree, error);
          });
        });
        findStatesContext.on('reject', function(bricknameTwo, error) {
          context.emit('reject', bricknameTwo, error);
        });
        findStatesContext.on('error', function(bricknameTwo, error) {
          context.emit('error', bricknameTwo, error);
        });
      }
    });
    findExecutionContext.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    findExecutionContext.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
  }

  /**
   *
   * @param counts
   * @private
   */
  _getExecutionUpdatedFields(counts, commandsCount) {
    const updatedExecutionFields = {};
    const states = {
      pending: counts.pending,
      running: counts.running,
      acked: counts.acked,
      finished: counts.finished,
      canceled: counts.canceled,
    };

    const finishedStates = states.finished + states.canceled;
    if (finishedStates >= commandsCount) {
      if (states.canceled > 0) {
        updatedExecutionFields.state = 'canceled';
      } else {
        updatedExecutionFields.state = 'finished';
      }
    } else if ((states.finished + states.canceled) - states.running === 0) {
      updatedExecutionFields.state = 'pending';
    } else {
      updatedExecutionFields.state = 'running';
    }

    updatedExecutionFields.updateTimestamp = Date.now();

    return updatedExecutionFields;
  }
}

module.exports = UpdateState;
