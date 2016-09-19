'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
const validate = require('cta-common').validate;
const schemas = {
  execution: require('../schemas/execution.js'), // eslint-disable-line global-require
  result: require('../schemas/result.js'), // eslint-disable-line global-require
  state: require('../schemas/state.js'), // eslint-disable-line global-require
};

/**
 * Database Interface MongoDB Helper Count class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Count extends BaseDBInterfaceHelper {

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
      const pattern = {
        type: 'object',
        items: {
          type: 'string',
        },
      };
      const validation = validate(job.payload, pattern);

      if (!validation.results.type.isValid) {
        reject(new Error('missing/incorrect \'type\' String in job payload'));
      }

      const queryValidation = validate(job.payload.query, {
        type: 'object',
        items: schemas[job.payload.type].dataQueryKeys(),
      });
      if (!queryValidation.isValid) {
        const resultsKeysArray = Object.keys(queryValidation.results);
        if (typeof queryValidation.results === 'object'
          && resultsKeysArray.length > 0) {
          for (let i = 0; i < resultsKeysArray.length; i++) {
            const key = resultsKeysArray[i];
            if (!queryValidation.results[key].isValid) {
              const error = queryValidation.results[key].error;
              reject(new Error(`incorrect '${key}' in job payload.query: ${error}`));
              break;
            }
          }
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
    const payload = context.data.payload;
    const mongoDbCollection = payload.type;
    const mongoDbQuery = new schemas[mongoDbCollection](payload.query);
    const countJob = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'count',
        args: [
          mongoDbQuery,
        ],
      },
    };
    const countContext = this.cementHelper.createContext(countJob);
    countContext.publish();
    countContext.on('done', function(brickname, countResponse) {
      context.emit('done', that.cementHelper.brickName, countResponse);
    });
    countContext.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    countContext.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
  }
}

module.exports = Count;
