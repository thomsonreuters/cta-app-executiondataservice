'use strict';
const BaseHelper = require('../../base/basehelper.js');

/**
 * Business Logic Execution Helper Save class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Save extends BaseHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates Execution object fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) { // eslint-disable-line no-unused-vars
    // todo: validate execution object fields
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
        quality: 'save',
      },
      payload: {
        type: 'execution',
        content: context.data.payload,
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
