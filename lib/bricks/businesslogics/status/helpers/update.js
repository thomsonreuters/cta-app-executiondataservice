'use strict';
const BaseHelper = require('../../base/basehelper.js');
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

/**
 * Business Logic Status Helper Update class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Update extends BaseHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates Status Model fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) { // eslint-disable-line no-unused-vars
    const job = context.data;
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      if (!job.payload.hasOwnProperty('id')
        || typeof job.payload.id !== 'string'
        || !(ObjectID.isValid(job.payload.id))) {
        reject(new Error('missing/incorrect \'id\' String value of ObjectID in job payload'));
        this._ack(context);
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
        quality: 'updateone',
      },
      payload: {
        type: 'status',
        id: context.data.payload.id,
        content: _.omit(context.data.payload, ['id']),
      },
    };
    const updateContext = this.cementHelper.createContext(data);
    updateContext.on('done', function(brickname, response) {
      context.emit('done', that.cementHelper.brickName, response);
    });
    updateContext.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    updateContext.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
    updateContext.publish();

    if (context.data.hasOwnProperty('id')) {
      that._ack(context);
    }
  }
}

module.exports = Update;
