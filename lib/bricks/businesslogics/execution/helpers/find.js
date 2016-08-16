'use strict';
const BaseHelper = require('../../base/basehelper.js');

/**
 * Business Logic Execution Helper Find class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Find extends BaseHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates Query Execution Model fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) { // eslint-disable-line no-unused-vars
    // todo: validate query execution object fields
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
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
        quality: 'find',
      },
      payload: {
        type: 'execution',
        query: context.data.payload,
      },
    };
    const output = this.cementHelper.createContext(data);
    output.publish();
    output.on('done', function(brickname, response) {
      context.emit('done', that.cementHelper.brickName, response);
    });
  }
}

module.exports = Find;
