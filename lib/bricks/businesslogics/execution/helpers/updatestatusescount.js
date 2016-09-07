'use strict';
const BaseHelper = require('../../base/basehelper.js');
const validate = require('cta-common').validate;
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
        const updateExecutionJob = {
          nature: {
            type: 'dbinterface',
            quality: 'updateone',
          },
          payload: {
            type: 'execution',
            id: execution.id,
            content: that._getExecutionUpdatedFields(statusesCount),
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
      });
      getStatusesCountContext.on('reject', function(bricknameOne, error) {
        context.emit('reject', bricknameOne, error);
      });
      getStatusesCountContext.on('error', function(bricknameOne, error) {
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
   * @param statusesCount
   * @private
   */
  _getExecutionUpdatedFields(statusesCount) {
    const updatedExecutionFields = {};
    updatedExecutionFields.failed = 0;
    updatedExecutionFields.inconclusive = 0;
    updatedExecutionFields.partial = 0;
    updatedExecutionFields.ok = 0;
    updatedExecutionFields.nbstatuses = 0;
    updatedExecutionFields.status = 'failed';
    statusesCount.forEach(function(status) {
      updatedExecutionFields[status.status] = status.count;
      updatedExecutionFields.nbstatuses += status.count;
    });

    if (updatedExecutionFields.failed > 0) {
      updatedExecutionFields.status = 'failed';
    } else if (updatedExecutionFields.partial > 0) {
      updatedExecutionFields.status = 'partial';
    } else if (updatedExecutionFields.inconclusive > 0) {
      updatedExecutionFields.status = 'inconclusive';
    } else if (updatedExecutionFields.ok > 0) {
      updatedExecutionFields.status = 'ok';
    }

    updatedExecutionFields.updatetimestamp = Date.now();

    return updatedExecutionFields;
  }
}

module.exports = UpdateStatusesCount;
