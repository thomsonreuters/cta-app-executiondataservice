/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const BaseHelper = require('../../base/basehelper.js');
const State = require('../../../../utils/datamodels/states.js');
const validate = require('cta-common').validate;

/**
 * Business Logic State Helper Create class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Create extends BaseHelper {
  constructor(cementHelper, logger, instancesQueue) {
    super(cementHelper, logger);
    this.instancesQueue = instancesQueue || 'cta.ids';
  }


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
        type: 'states',
        content: state,
      },
    };
    const output = this.cementHelper.createContext(data);
    output.on('done', function(brickname, response) {
      context.emit('done', that.cementHelper.brickName, response);
      const UpdateExecutionStatesJob = {
        nature: {
          type: 'executions',
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
        const updateInstanceExecutionStateJob = {
          nature: {
            type: 'messages',
            quality: 'produce',
          },
          payload: {
            nature: {
              type: 'instances',
              quality: 'update',
            },
            payload: {
              query: {
                hostname: response.hostname,
              },
              content: {
                executionId: isFinishedState ? null : response.executionId,
                state: isFinishedState ? null : response.status,
              },
            },
          },
          // payload: {
          //   queue: that.instancesQueue,
          //   message: {
          //     nature: {
          //       type: 'instances',
          //       quality: 'update',
          //     },
          //     payload: {
          //       query: {
          //         hostname: response.hostname,
          //       },
          //       content: {
          //         executionId: isFinishedState ? null : response.executionId,
          //         state: isFinishedState ? null : response.status,
          //       },
          //     },
          //   },
          // },
        };
        const updateInstanceExecutionStateContext =
          this.cementHelper.createContext(updateInstanceExecutionStateJob);
        updateInstanceExecutionStateContext.publish();
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
