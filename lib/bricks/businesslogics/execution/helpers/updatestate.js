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
class Updatestate extends BaseHelper {

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
      const findStates = {
        nature: {
          type: 'dbinterface',
          quality: 'getstatescount',
        },
        payload: {
          filter: {
            limit: execution.commandcount,
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
        const updateFields = that._getExecutionUpdatedFields(states, execution.commandcount);
        const updateExecutionJob = {
          nature: {
            type: 'dbinterface',
            quality: 'updateone',
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
          context.emit('done', that.cementHelper.brickName, updatedExecution);
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
  _getExecutionUpdatedFields(counts, commandcount) {
    const updatedExecutionFields = {};
    const states = {
      pending: counts.pending,
      running: counts.running,
      acked: counts.acked,
      finished: counts.finished,
    };

    if (states.acked + states.finished === commandcount) {
      updatedExecutionFields.state = 'finished';
    } else if (states.acked + states.pending <= commandcount && states.running === 0) {
      updatedExecutionFields.state = 'pending';
    } else {
      updatedExecutionFields.state = 'running';
    }

    updatedExecutionFields.updatetimestamp = Date.now();

    return updatedExecutionFields;
  }
}

module.exports = Updatestate;
