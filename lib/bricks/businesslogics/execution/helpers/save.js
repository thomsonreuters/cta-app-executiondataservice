'use strict';
const Helper = require('../../base/basehelper.js');

/**
 * Business Logic Execution Helper Save class
 *
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Save extends Helper {
  /**
   * Process the context
   * @param {Context} context - a Context
   */
  _process(context) {
    context.emit('done', context.data);
  }
}

module.exports = Save;
