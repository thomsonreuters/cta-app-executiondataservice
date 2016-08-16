'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');

/**
 * Database Interface MongoDB Helper Save class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Save extends BaseDBInterfaceHelper {

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
    const mongoDbDocument = context.data.payload.content;
    const data = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'save',
        args: [
          mongoDbDocument,
        ],
      },
    };
    const output = this.cementHelper.createContext(data);
    output.publish();
    output.on('done', function(brickname, response) {
      context.emit('done', that.cementHelper.brickName, response);
    });
  }
}

module.exports = Save;
