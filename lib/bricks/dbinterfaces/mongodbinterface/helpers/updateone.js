'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
const ObjectID = require('bson').ObjectID;
const validate = require('cta-common').validate;
const _ = require('lodash');
const schemas = {
  execution: require('../schemas/execution.js'), // eslint-disable-line global-require
  status: require('../schemas/status.js'), // eslint-disable-line global-require
  state: require('../schemas/state.js'), // eslint-disable-line global-require
};

/**
 * Database Interface MongoDB Helper UpdateOne class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class UpdateOne extends BaseDBInterfaceHelper {

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

      if (!validate(job.payload.filter, { type: 'object', optional: true }).isValid) {
        reject(new Error('incorrect \'filter\' Object in job payload'));
      }

      if (!validate(job.payload.content, { type: 'object' }).isValid) {
        reject(new Error('missing/incorrect \'content\' Object in job payload'));
      }

      if (!validate(job.payload.id, { type: 'identifier' }).isValid) {
        reject(new Error('missing/incorrect \'id\' String value of ObjectID in job payload'));
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
    const mongoDbFilter = _.assignIn({
      _id: new ObjectID(context.data.payload.id),
    }, context.data.payload.filter);
    const mongoDbDocument = {
      $set: new schemas[mongoDbCollection](context.data.payload.content),
    };
    const mongoDbOptions = {
      returnOriginal: false,
    };

    const data = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'findOneAndUpdate',
        args: [
          mongoDbFilter,
          mongoDbDocument,
          mongoDbOptions,
        ],
      },
    };
    const output = this.cementHelper.createContext(data);
    output.on('done', function(brickname, response) {
      if (response.ok) {
        if (response.hasOwnProperty('value') && response.value !== null) {
          const object = schemas[mongoDbCollection].toCTAData(response.value);
          context.emit('done', that.cementHelper.brickName, object);
        } else {
          context.emit('done', that.cementHelper.brickName, null);
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

module.exports = UpdateOne;
