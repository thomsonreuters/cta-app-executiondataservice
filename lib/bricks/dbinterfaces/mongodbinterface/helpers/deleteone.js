'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
const _ = require('lodash');
const ObjectID = require('bson').ObjectID;

/**
 * Database Interface MongoDB Helper DeleteOne class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class DeleteOne extends BaseDBInterfaceHelper {

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

      if (!job.payload.hasOwnProperty('id')
        || typeof job.payload.id !== 'string'
        || !(ObjectID.isValid(job.payload.id))) {
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

    const data = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'findOneAndDelete',
        args: [
          {
            _id: new ObjectID(context.data.payload.id),
          },
        ],
      },
    };
    const output = this.cementHelper.createContext(data);
    output.on('done', function(brickname, response) {
      if (response.ok) {
        if (response.hasOwnProperty('value') && response.value !== null) {
          const object = _.omit(response.value, '_id');
          object.id = response.value._id.toString();
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

module.exports = DeleteOne;
