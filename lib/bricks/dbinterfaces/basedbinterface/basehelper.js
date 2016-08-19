'use strict';

/**
 * Database Interface Helper Base class
 *
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class BaseDBInterfaceHelper {
  /**
   * constructor - Create a new Database Interface Helper Base instance
   *
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {Logger} logger - logger instance
   */
  constructor(cementHelper, logger) {
    if (cementHelper === null || typeof cementHelper !== 'object') {
      throw (new Error('missing/incorrect \'cementHelper\' CementHelper argument'));
    }
    this.cementHelper = cementHelper;

    if (logger === null || typeof logger !== 'object') {
      throw (new Error('missing/incorrect \'logger\' Logger argument'));
    }
    this.logger = logger;
  }

  /**
   * Validates Context properties specific to this Helper
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) { // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      resolve({ ok: 1 });
    });
  }

  /**
   * Process the context
   * @abstract
   * @param {Context} context - a Context
   * @returns {Context}
   */
  _process(context) {
    context.emit('done', this.cementHelper.brickName, {});
  }
}

module.exports = BaseDBInterfaceHelper;
