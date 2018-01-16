/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const BaseHelper = require('../../base/basehelper.js');
const validate = require('cta-common').validate;
// const Execution = require('../../../../utils/datamodels/execution.js');
// const _ = require('lodash');

/**
 * Business Logic Execution Helper Finalize class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Finalize extends BaseHelper {

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
        type: 'executions',
        id: context.data.payload.executionId,
      },
    };
    const findExecutionContext = this.cementHelper.createContext(findExecution);
    findExecutionContext.on('done', function(brickname, execution) {
      that._onFindExecution(context, execution);
    });
    findExecutionContext.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    findExecutionContext.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
    findExecutionContext.publish();
  }

  _onFindExecution(context, execution) {
    const that = this;

    const isFinishedState = ['finished', 'canceled', 'timeout'].indexOf(execution.state) !== -1;
    if (!execution.completeTimestamp && isFinishedState) {
      const getResultsIndexJob = {
        nature: {
          type: 'dbInterface',
          quality: 'getResultsIndex',
        },
        payload: {
          query: {
            executionId: context.data.payload.executionId,
          },
        },
      };
      const getResultsIndexContext = this.cementHelper.createContext(getResultsIndexJob);
      getResultsIndexContext.on('done', function (brickname, indexes) {
        that._onGetResultsIndex(context, execution, indexes);
      });
      getResultsIndexContext.on('reject', function(brickname, error) {
        context.emit('reject', brickname, error);
      });
      getResultsIndexContext.on('error', function(brickname, error) {
        context.emit('error', brickname, error);
      });
      getResultsIndexContext.publish();
    } else {
      context.emit('done', that.cementHelper.brickName, execution);
    }
  }

  _onGetResultsIndex(context, execution, resultsIndexes) {
    const that = this;

    const keys = Object.keys(resultsIndexes);
    const noContinuousGap = keys.every(function(key) {
      const index = resultsIndexes[key];
      return (index.maxidx - index.minidx) + 1 === index.idxcount;
    });
    if (noContinuousGap) {
      const getStatesIndexJob = {
        nature: {
          type: 'dbInterface',
          quality: 'getStatesIndex',
        },
        payload: {
          query: {
            executionId: context.data.payload.executionId,
          },
        },
      };
      const getStatesIndexContext = this.cementHelper.createContext(getStatesIndexJob);
      getStatesIndexContext.on('done', function (brickname, statesIndexes) {
        that._onGetStatesIndex(context, execution, resultsIndexes, statesIndexes);
      });
      getStatesIndexContext.on('reject', function(brickname, error) {
        context.emit('reject', brickname, error);
      });
      getStatesIndexContext.on('error', function(brickname, error) {
        context.emit('error', brickname, error);
      });
      getStatesIndexContext.publish();
    } else {
      context.emit('done', that.cementHelper.brickName, execution);
    }
  }

  _onGetStatesIndex(context, execution, resultsIndexes, statesIndexes) {
    const that = this;

    const keys = Object.keys(statesIndexes);
    const noMissingResults = keys.every(function(key) {
      const hasKey = resultsIndexes.hasOwnProperty(key);
      let result = true;
      if (hasKey) {
        result = resultsIndexes[key].maxidx === statesIndexes[key].maxidx;
      }
      return result;
    });
    if (noMissingResults) {
      const updateFields = {
        completeTimestamp: Date.now(),
      };
      const updateExecutionJob = {
        nature: {
          type: 'dbInterface',
          quality: 'updateOne',
        },
        payload: {
          type: 'executions',
          id: execution.id,
          content: updateFields,
        },
      };
      const updateExecutionContext = this.cementHelper.createContext(updateExecutionJob);
      updateExecutionContext.on('done', function(brickname, updatedExecution) {
        context.emit('done', that.cementHelper.brickName, updatedExecution);
        that._onExecutionCompleted(updatedExecution);
      });
      updateExecutionContext.on('reject', function(brickname, error) {
        context.emit('reject', brickname, error);
      });
      updateExecutionContext.on('error', function(brickname, error) {
        context.emit('error', brickname, error);
      });
      updateExecutionContext.publish();
    } else {
      context.emit('done', that.cementHelper.brickName, execution);
    }
  }

  _onExecutionCompleted(execution) {
    const that = this;
    const executionCompletdContext = {
      nature: {
        type: 'executions',
        quality: 'complete',
      },
      payload: {
        id: execution.id,
        content: execution,
      },
    };

    const executionCompleted = this.cementHelper.createContext(executionCompletdContext);
    executionCompleted.on('done', function (brickname, response) {
      that.logger.info(brickname, `Execution complete execution.id: ${execution.id} 
      has been triggered, ${JSON.stringify(response)}`);
    });
    executionCompleted.on('reject', function (brickname, error) {
      that.logger.error(brickname,
        `Cannot trigger the execution complete execution.id: ${execution.id}`, error);
    });
    executionCompleted.on('error', function (brickname, error) {
      that.logger.error(brickname, error,
        `Cannot trigger the execution complete execution.id: ${execution.id}`, error);
    });
    executionCompleted.publish();
  }
}

module.exports = Finalize;
