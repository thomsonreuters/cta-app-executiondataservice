'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
const validate = require('cta-common').validate;

/**
 * Database Interface MongoDB Helper Find class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Find extends BaseDBInterfaceHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates abstract query fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) { // eslint-disable-line no-unused-vars
    const job = context.data;
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      if (!validate(job.payload.type, { type: 'string' }).isValid) {
        reject(new Error('missing/incorrect \'type\' String in job payload'));
      }

      if (!validate(job.payload.filter, { type: 'object' }).isValid) {
        reject(new Error('missing/incorrect \'filter\' Object in job payload'));
      }

      if (!validate(job.payload.filter.limit, { type: 'number' }).isValid) {
        reject(new Error('missing/incorrect \'limit\' Number in job payload.filter'));
      }

      if (!validate(job.payload.filter.offset, { type: 'number' }).isValid) {
        reject(new Error('missing/incorrect \'offset\' Number in job payload.filter'));
      }

      if (!validate(job.payload.filter.sort,
          { type: 'object', optional: true, defaultTo: {} }).isValid) {
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
    const payload = context.data.payload;
    const mongoDbCollection = payload.type;
    const mongoDbQuery = payload.query;
    const mongoDbFilter = {
      limit: payload.filter.limit,
      skip: payload.filter.offset,
    };
    if (payload.filter.hasOwnProperty('sort')) {
      mongoDbFilter.sort = payload.filter.sort;
    }

    const data = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'find',
        args: [
          mongoDbQuery,
          mongoDbFilter,
        ],
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
