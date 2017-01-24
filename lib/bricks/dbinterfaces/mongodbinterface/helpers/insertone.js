'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
const validate = require('cta-common').validate;
const schemas = {
  executions: require('../schemas/executions.js'), // eslint-disable-line global-require
  results: require('../schemas/results.js'), // eslint-disable-line global-require
  states: require('../schemas/states.js'), // eslint-disable-line global-require
};

/**
 * Database Interface MongoDB Helper InsertOne class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class InsertOne extends BaseDBInterfaceHelper {

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

      if (!validate(job.payload.content, { type: 'object' }).isValid) {
        reject(new Error('missing/incorrect \'content\' Object in job payload'));
      }

      if (!validate(job.payload.content.id, { type: 'identifier' }).isValid) {
        reject(new Error('missing/incorrect \'id\' String value ' +
          'of ObjectID in job payload.content'));
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
    const mongoDbCollection = context.data.payload.type;
    const mongoDbDocument = new schemas[mongoDbCollection](context.data.payload.content);

    const data = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'insertOne',
        args: [
          mongoDbDocument,
        ],
      },
    };
    const output = this.cementHelper.createContext(data);
    output.on('done', function(brickname, response) {
      if (response.hasOwnProperty('result') && response.hasOwnProperty('ops')) {
        if (response.result.ok && response.result.n > 0 && response.ops.length > 0) {
          const result = schemas[mongoDbCollection].toCTAData(response.ops[0]);
          context.emit('done', that.cementHelper.brickName, result);
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
  }
}

module.exports = InsertOne;
