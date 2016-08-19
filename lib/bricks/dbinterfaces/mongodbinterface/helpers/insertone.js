'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
const _ = require('lodash');
const ObjectID = require('bson').ObjectID;

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
      if (!job.payload.hasOwnProperty('type') || typeof job.payload.type !== 'string') {
        reject(new Error('missing/incorrect \'type\' String in job payload'));
      }

      if (!job.payload.hasOwnProperty('content')
        || typeof job.payload.content !== 'object'
        || job.payload.content === null) {
        reject(new Error('missing/incorrect \'content\' Object in job payload'));
      }

      if (!job.payload.content.hasOwnProperty('id')
        || typeof job.payload.content.id !== 'string'
        || !(ObjectID.isValid(job.payload.content.id))) {
        reject(new Error('missing/incorrect \'id\' ' +
          'String value of ObjectID in job payload.content'));
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

    const mongoDbDocument = _.omit(context.data.payload.content, ['id']);
    mongoDbDocument._id = new ObjectID(context.data.payload.content.id);

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
          const result = _.cloneDeep(response.ops[0]);
          result.id = result._id.toString();
          delete result._id;
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
