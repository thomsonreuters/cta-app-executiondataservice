'use strict';
const co = require('co');
const fs = require('fs');
const path = require('path');
const Brick = require('cta-brick');

/**
 * Business Logic Base class
 *
 * @augments Brick
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {BrickConfig} configuration - cement configuration of the brick
 * @property {Map<String, Helper>} helpers - Map of Helpers
 */
class Base extends Brick {
  /**
   * constructor - Create a new Business Logic Base instance
   *
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {BrickConfig} configuration - cement configuration of the brick
   */
  constructor(cementHelper, configuration) {
    super(cementHelper, configuration);
    this.helpers = new Map();
    const helpersDirectory = path.join(__dirname, '..',
      this.constructor.name.toLowerCase(), 'helpers');

    // TODO: remove dynamic loading
    // instead, make each Child class require their helpers explicitly
    const helpersList = fs.readdirSync(helpersDirectory);
    helpersList.forEach((helperName) => {
      const helperPath = path.join(helpersDirectory, helperName);
      const HelperConstructor = require(helperPath); // eslint-disable-line global-require
      const helperInstance = new HelperConstructor(this.cementHelper, this.logger);
      const noExtName = helperName.endsWith('.js') ? helperName.slice(0, -3) : helperName;
      this.helpers.set(noExtName, helperInstance);
    });
  }

  /**
   * Validates Context properties
   * @param {Context} context - a Context
   * @returns {Promise}
   */
  validate(context) {
    const job = context.data;
    const that = this;
    const superValidate = super.validate.bind(this);
    return co(function* validateCoroutine() {
      yield superValidate(context);

      const type = job.nature.type.trim().toLowerCase();
      if (type !== that.constructor.name.toLowerCase()) {
        throw (new Error(`type ${job.nature.type} not supported`));
      }

      const quality = job.nature.quality.trim().toLowerCase();
      if (!that.helpers.has(quality)) {
        throw (new Error(`quality ${job.nature.quality} not supported`));
      }

      yield that.helpers.get(quality)._validate(context);

      return { ok: 1 };
    });
  }

  /**
   * Process the context
   * @param {Context} context - a Context
   */
  process(context) {
    const quality = context.data.nature.quality.trim().toLowerCase();
    return this.helpers.get(quality)._process(context);
  }
}

module.exports = Base;