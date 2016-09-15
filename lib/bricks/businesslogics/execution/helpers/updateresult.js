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
        type: 'dbinterface',
        quality: 'findbyid',
      },
      payload: {
        type: 'execution',
        id: context.data.payload.executionId,
      },
    };
    const findExecutionContext = this.cementHelper.createContext(findExecution);
    findExecutionContext.publish();
    findExecutionContext.on('done', function(brickname, execution) {
      const query = {
        executionId: context.data.payload.executionId,
      };
      const getResultsCountJob = {
        nature: {
          type: 'dbinterface',
          quality: 'getresultscount',
        },
        payload: {
          query: query,
        },
      };
      const getResultsCountContext = this.cementHelper.createContext(getResultsCountJob);
      getResultsCountContext.publish();
      getResultsCountContext.on('done', function(bricknameOne, response) {
        if (response.totalCount >= execution.nbresults) {
          const updateFields = that._getExecutionUpdatedFields(response);
          const updateExecutionJob = {
            nature: {
              type: 'dbinterface',
              quality: 'updateone',
            },
            payload: {
              type: 'execution',
              id: execution.id,
              filter: {
                nbresults: { $lt: response.totalCount },
              },
              content: updateFields,
            },
          };
          const updateExecutionContext = this.cementHelper.createContext(updateExecutionJob);
          updateExecutionContext.publish();
          updateExecutionContext.on('done', function(bricknameTwo, updatedExecution) {
            context.emit('done', that.cementHelper.brickName, updatedExecution);
          });
          updateExecutionContext.on('reject', function(bricknameTwo, error) {
            context.emit('reject', bricknameTwo, error);
          });
          updateExecutionContext.on('error', function(bricknameTwo, error) {
            context.emit('error', bricknameTwo, error);
          });
        } else {
          context.emit('done', that.cementHelper.brickName, execution);
        }
      });
      getResultsCountContext.on('reject', function(bricknameOne, error) {
        context.emit('reject', bricknameOne, error);
      });
      getResultsCountContext.on('error', function(bricknameOne, error) {
        context.emit('error', bricknameOne, error);
      });
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
   * @param counts.resultsCount
   * @param counts.totalCount
   * @private
   */
  _getExecutionUpdatedFields(counts) {
    const updatedExecutionFields = {};
    updatedExecutionFields.failed = counts.resultsCount.failed;
    updatedExecutionFields.inconclusive = counts.resultsCount.inconclusive;
    updatedExecutionFields.partial = counts.resultsCount.partial;
    updatedExecutionFields.ok = counts.resultsCount.ok;
    updatedExecutionFields.result = 'failed';
    updatedExecutionFields.nbresults = counts.totalCount;

    if (updatedExecutionFields.failed > 0) {
      updatedExecutionFields.result = 'failed';
    } else if (updatedExecutionFields.partial > 0) {
      updatedExecutionFields.result = 'partial';
    } else if (updatedExecutionFields.inconclusive > 0) {
      updatedExecutionFields.result = 'inconclusive';
    } else if (updatedExecutionFields.ok > 0) {
      updatedExecutionFields.result = 'ok';
    }

    updatedExecutionFields.updatetimestamp = Date.now();

    return updatedExecutionFields;
  }
}

module.exports = UpdateResult;
