'use strict';
const BaseHelper = require('../../base/basehelper.js');
const Execution = require('../models/execution.js');

/**
 * Business Logic Execution Helper Create class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Create extends BaseHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates Execution Model fields
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
    const execution = new Execution(context.data.payload);
    const data = {
      nature: {
        type: 'dbinterface',
        quality: 'insertone',
      },
      payload: {
        type: 'execution',
        content: execution,
      },
    };
    const output = this.cementHelper.createContext(data);
    output.on('done', function(brickname, response) {
      context.emit('done', that.cementHelper.brickName, response);
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

module.exports = Create;
