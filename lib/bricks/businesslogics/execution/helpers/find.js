'use strict';
const BaseHelper = require('../../base/basehelper.js');
const validate = require('cta-common').validate;

/**
 * Business Logic Execution Helper Find class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Find extends BaseHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates Query Execution Model fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) { // eslint-disable-line no-unused-vars
    const job = context.data;
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      const jobPayloadPattern = {
        type: 'object',
        items: {
          filter: {
            type: 'object',
            items: {
              limit: 'number',
              offset: 'number',
              sort: { type: 'object', optional: true },
            },
          },
          query: {
            type: 'object',
          },
        },
      };
      const validation = validate(job.payload, jobPayloadPattern);

      const filterResult = validation.results.filter;
      if (!filterResult.isValid) {
        if (typeof filterResult.results === 'object'
          && Object.keys(filterResult.results).length > 0) {
          if (!filterResult.results.limit.isValid) {
            reject(new Error('missing/incorrect \'limit\' Number in job payload.filter'));
          }

          if (!filterResult.results.offset.isValid) {
            reject(new Error('missing/incorrect \'offset\' Number in job payload.filter'));
          }

          if (!filterResult.results.sort.isValid) {
            reject(new Error('incorrect \'sort\' Object in job payload.filter'));
          }
        } else {
          reject(new Error('missing/incorrect \'filter\' Object in job payload'));
        }
      }

      const queryResult = validation.results.query;
      if (!queryResult.isValid) {
        if (typeof queryResult.results === 'object'
          && Object.keys(queryResult.results).length > 0) {
          // ...
        } else {
          reject(new Error('missing/incorrect \'query\' Object in job payload'));
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
    const data = {
      nature: {
        type: 'dbinterface',
        quality: 'find',
      },
      payload: {
        type: 'execution',
        filter: context.data.payload.filter,
        query: context.data.payload.query,
      },
    };
    const output = this.cementHelper.createContext(data);
    output.on('done', function(brickname, response) {
      context.emit('done', that.cementHelper.brickName, response);
    });
    output.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    output.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
    output.publish();
  }
}

module.exports = Find;
