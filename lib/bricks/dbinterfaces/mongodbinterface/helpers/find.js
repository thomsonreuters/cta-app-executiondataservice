'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
const validate = require('cta-common').validate;
const schemas = {
  executions: require('../schemas/executions.js'), // eslint-disable-line global-require
  results: require('../schemas/results.js'), // eslint-disable-line global-require
  states: require('../schemas/states.js'), // eslint-disable-line global-require
};

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
      const pattern = {
        type: 'object',
        items: {
          type: 'string',
          filter: {
            type: 'object',
            items: {
              limit: 'number',
              offset: 'number',
              sort: { type: 'object', optional: true },
            },
          },
        },
      };
      const validation = validate(job.payload, pattern);

      if (!validation.results.type.isValid) {
        reject(new Error('missing/incorrect \'type\' String in job payload'));
      }

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
      const objects = [];
      response.forEach(function(doc) {
        objects.push(schemas[mongoDbCollection].toCTAData(doc));
      });
      context.emit('done', that.cementHelper.brickName, objects);
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
