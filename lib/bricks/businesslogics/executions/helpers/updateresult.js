'use strict';
const BaseHelper = require('../../base/basehelper.js');
const validate = require('cta-common').validate;
// const Execution = require('../../../../utils/datamodels/execution.js');
// const _ = require('lodash');

/**
 * Business Logic Execution Helper UpdateResult class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class UpdateResult extends BaseHelper {

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
    const getResultsCountJob = {
      nature: {
        type: 'dbInterface',
        quality: 'count',
      },
      payload: {
        type: 'results',
        query: {
          executionId: context.data.payload.executionId,
        },
      },
    };
    const getResultsCountContext = this.cementHelper.createContext(getResultsCountJob);
    getResultsCountContext.on('done', function(bricknameOne, count) {
      that._onGetResultsCount(context, execution, count);
    });
    getResultsCountContext.on('reject', function(bricknameOne, error) {
      context.emit('reject', bricknameOne, error);
    });
    getResultsCountContext.on('error', function(bricknameOne, error) {
      context.emit('error', bricknameOne, error);
    });
    getResultsCountContext.publish();
  }

  _onGetResultsCount(context, execution, count) {
    const that = this;
    if (count >= execution.resultsCount) {
      const getResultsAggregationJob = {
        nature: {
          type: 'dbInterface',
          quality: 'getResultsCount',
        },
        payload: {
          query: {
            executionId: context.data.payload.executionId,
          },
        },
      };
      const getResultsAggregationContext =
        this.cementHelper.createContext(getResultsAggregationJob);
      getResultsAggregationContext.on('done', function(bricknameTwo, aggregate) {
        that._onGetResultsAggregation(context, execution, count, aggregate);
      });
      getResultsAggregationContext.on('reject', function(bricknameTwo, error) {
        context.emit('reject', bricknameTwo, error);
      });
      getResultsAggregationContext.on('error', function(bricknameTwo, error) {
        context.emit('error', bricknameTwo, error);
      });
      getResultsAggregationContext.publish();
    } else {
      context.emit('done', that.cementHelper.brickName, execution);
    }
  }

  _onGetResultsAggregation(context, execution, count, aggregate) {
    const that = this;
    const updateFields = that._getExecutionUpdatedFields(aggregate, count);
    const updateExecutionJob = {
      nature: {
        type: 'dbInterface',
        quality: 'updateOne',
      },
      payload: {
        type: 'executions',
        id: execution.id,
        filter: {
          resultsCount: { $lt: count },
        },
        content: updateFields,
      },
    };
    const updateExecutionContext = this.cementHelper.createContext(updateExecutionJob);
    updateExecutionContext.on('done', function(bricknameThree, updatedExecution) {
      that._onUpdateExecution(context, updatedExecution);
    });
    updateExecutionContext.on('reject', function(bricknameThree, error) {
      context.emit('reject', bricknameThree, error);
    });
    updateExecutionContext.on('error', function(bricknameThree, error) {
      context.emit('error', bricknameThree, error);
    });
    updateExecutionContext.publish();
  }

  /**
   * @param aggregation - aggregation of results
   * @param count - total number of results, including overriden ones
   * @private
   */
  _getExecutionUpdatedFields(aggregation, count) {
    const updatedExecutionFields = {};
    updatedExecutionFields.failed = aggregation.failed;
    updatedExecutionFields.inconclusive = aggregation.inconclusive;
    updatedExecutionFields.partial = aggregation.partial;
    updatedExecutionFields.ok = aggregation.ok;
    updatedExecutionFields.result = 'failed';
    updatedExecutionFields.resultsCount = count;

    if (updatedExecutionFields.failed > 0) {
      updatedExecutionFields.result = 'failed';
    } else if (updatedExecutionFields.partial > 0) {
      updatedExecutionFields.result = 'partial';
    } else if (updatedExecutionFields.inconclusive > 0) {
      updatedExecutionFields.result = 'inconclusive';
    } else if (updatedExecutionFields.ok > 0) {
      updatedExecutionFields.result = 'ok';
    }

    updatedExecutionFields.updateTimestamp = Date.now();

    return updatedExecutionFields;
  }

  _onUpdateExecution(context, updatedExecution) {
    const that = this;
    if (updatedExecution !== null) {
      const finalizeExecutionJob = {
        nature: {
          type: 'executions',
          quality: 'finalize',
        },
        payload: {
          executionId: updatedExecution.id,
        },
      };
      const finalizeExecutionContext =
        this.cementHelper.createContext(finalizeExecutionJob);
      finalizeExecutionContext.on('done', function(bricknameFour, finalizedExecution) {
        context.emit('done', that.cementHelper.brickName, finalizedExecution);
      });
      finalizeExecutionContext.on('reject', function(bricknameFour, error) {
        context.emit('reject', bricknameFour, error);
      });
      finalizeExecutionContext.on('error', function(bricknameFour, error) {
        context.emit('error', bricknameFour, error);
      });
      finalizeExecutionContext.publish();
    } else {
      context.emit('done', that.cementHelper.brickName, updatedExecution);
    }
  }
}

module.exports = UpdateResult;
