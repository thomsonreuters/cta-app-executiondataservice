'use strict';
const BaseHelper = require('../../base/basehelper.js');
const State = require('../../../../utils/datamodels/state.js');
const validate = require('cta-common').validate;

/**
 * Business Logic State Helper Create class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Create extends BaseHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates State Model fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) {
    return new Promise((resolve, reject) => {
      const pattern = {
        type: 'object',
        items: State.keys(),
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
    const state = new State(context.data.payload);
    const data = {
      nature: {
        type: 'dbInterface',
        quality: 'insertOne',
      },
      payload: {
        type: 'state',
        content: state,
      },
    };
    const output = this.cementHelper.createContext(data);
    output.on('done', function(brickname, response) {
      context.emit('done', that.cementHelper.brickName, response);
      const UpdateExecutionStatesJob = {
        nature: {
          type: 'execution',
          quality: 'updateState',
        },
        payload: {
          executionId: state.executionId,
        },
      };
      const UpdateExecutionStatesContext =
        this.cementHelper.createContext(UpdateExecutionStatesJob);
      UpdateExecutionStatesContext.publish();

      if (response.hasOwnProperty('hostname')) {
        const isFinishedState = ['finished', 'canceled', 'timeout'].indexOf(response.status) !== -1;
        if (isFinishedState) {
          const sendInstanceStopEventJob = {
            nature: {
              type: 'message',
              quality: 'produce',
            },
            payload: {
              nature: {
                type: 'instance',
                quality: 'done',
              },
              payload: {
                hostname: response.hostname,
                executionId: response.executionId,
              },
            },
          };
          const sendInstanceStopEventContext =
            this.cementHelper.createContext(sendInstanceStopEventJob);
          sendInstanceStopEventContext.publish();
        } else if (response.status === 'running') {
          const sendInstanceStartEventJob = {
            nature: {
              type: 'message',
              quality: 'produce',
            },
            payload: {
              nature: {
                type: 'instance',
                quality: 'start',
              },
              payload: {
                hostname: response.hostname,
                executionId: response.executionId,
              },
            },
          };
          const sendInstanceStartEventContext =
            this.cementHelper.createContext(sendInstanceStartEventJob);
          sendInstanceStartEventContext.publish();
        }
      }
    });
    output.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    output.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
    output.publish();

    if (context.data.hasOwnProperty('id')) {
      that._ack(context);
    }
  }
}

module.exports = Create;
