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
      if (!validate(job.payload.filter, { type: 'object' }).isValid) {
        reject(new Error('missing/incorrect \'filter\' Object in job payload'));
      }

      if (!validate(job.payload.filter.limit, { type: 'number' }).isValid) {
        reject(new Error('missing/incorrect \'limit\' Number in job payload.filter'));
      }

      if (!validate(job.payload.filter.offset, { type: 'number' }).isValid) {
        reject(new Error('missing/incorrect \'offset\' Number in job payload.filter'));
      }

      if (!validate(job.payload.filter.sort, { type: 'object', optional: true }).isValid) {
        reject(new Error('incorrect \'sort\' Object in job payload.filter'));
      }

      if (!validate(job.payload.query, { type: 'object' }).isValid) {
        reject(new Error('missing/incorrect \'query\' Object in job payload'));
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
