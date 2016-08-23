'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');

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
      if (!job.payload.hasOwnProperty('type') || typeof job.payload.type !== 'string') {
        reject(new Error('missing/incorrect \'type\' String in job payload'));
      }

      if (!job.payload.hasOwnProperty('filter')
        || typeof job.payload.filter !== 'object') {
        reject(new Error('missing/incorrect \'filter\' Object in job payload'));
      }

      if (!job.payload.filter.hasOwnProperty('limit')
        || typeof job.payload.filter.limit !== 'number') {
        reject(new Error('missing/incorrect \'limit\' Number in job payload.filter'));
      }

      if (!job.payload.filter.hasOwnProperty('offset')
        || typeof job.payload.filter.offset !== 'number') {
        reject(new Error('missing/incorrect \'offset\' Number in job payload.filter'));
      }

      if (job.payload.filter.hasOwnProperty('sort')
        && (typeof job.payload.filter.sort !== 'object' || job.payload.filter.sort === null)) {
        reject(new Error('incorrect \'sort\' Object in job payload.filter'));
      }

      if (!job.payload.hasOwnProperty('query')
        || typeof job.payload.query !== 'object') {
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
