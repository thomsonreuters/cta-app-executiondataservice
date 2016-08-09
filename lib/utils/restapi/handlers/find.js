'use strict';
/**
 * Provider class for RESTAPI routes
 * @property {CementHelper} cementHelper - cementHelper from a cta-restapi Brick
 */
class MyProvider {
  /**
   *
   * @param {CementHelper} cementHelper - cementHelper from a cta-restapi Brick
   */
  constructor(cementHelper) {
    this.cementHelper = cementHelper;
  }

  findOne(req, res) {
    res.send(`ok from brick ${this.cementHelper.brickName}`);
  }
}

module.exports = MyProvider;
