'use strict';
const BaseHelper = require('../../base/basehelper.js');
// const validate = require('cta-common').validate;
// const Execution = require('../../../../utils/datamodels/execution.js');
// const _ = require('lodash');

/**
 * Business Logic Execution Helper UpdateStatuses class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class UpdateStatusesCount extends BaseHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates Execution Model fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) {
    return new Promise((resolve, reject) => {
      resolve({ ok: 1 });
    });
  }

  /**
   * Process the context
   * @param {Context} context - a Context
   */
  _process(context) {
    const that = this;
    const query = {
      executionId: context.data.payload.executionId,
    };

    // find execution by id
    // find statuses matching executionid
    //    (should find only the latest status for each unique testId)
    // compute statuses counts
    // update execution

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
      const getStatusesCountJob = {
        nature: {
          type: 'dbinterface',
          quality: 'getstatusescount',
        },
        payload: {
          query: query,
        },
      };
      const getStatusesCountContext = this.cementHelper.createContext(getStatusesCountJob);
      getStatusesCountContext.publish();
      getStatusesCountContext.on('done', function(bricknameOne, statusesCount) {
        const updatedExecutionFields = {};
        updatedExecutionFields.failed = 0;
        updatedExecutionFields.inconclusive = 0;
        updatedExecutionFields.partial = 0;
        updatedExecutionFields.ok = 0;
        statusesCount.forEach(function(status) {
          updatedExecutionFields[status.status] = status.count;
        });

        const updateExecutionJob = {
          nature: {
            type: 'dbinterface',
            quality: 'updateone',
          },
          payload: {
            type: 'execution',
            id: execution.id,
            content: updatedExecutionFields,
          },
        };
        const updateExecutionContext = this.cementHelper.createContext(updateExecutionJob);
        updateExecutionContext.publish();
        updateExecutionContext.on('done', function(bricknameTwo, updatedExecution) {
          context.emit('done', that.cementHelper.brickName, updatedExecution);
        });
      });
    });

    // findStatusesContext.on('reject', function(brickname, error) {
    //   context.emit('reject', brickname, error);
    // });
    // findStatusesContext.on('error', function(brickname, error) {
    //   context.emit('error', brickname, error);
    // });
  }
}

module.exports = UpdateStatusesCount;
