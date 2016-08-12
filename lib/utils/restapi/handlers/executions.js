'use strict';
/**
 * Handler class for RESTAPI handlers : EXECUTIONS
 * @property {CementHelper} cementHelper - cementHelper from a cta-restapi Brick
 */
class ExecutionsHandler {
  /**
   *
   * @param {CementHelper} cementHelper - cementHelper from a cta-restapi Brick
   */
  constructor(cementHelper) {
    this.cementHelper = cementHelper;
  }

  /**
   * Publishes request body in an execution-save Context
   * @param req
   * @param res
   * @param next
   */
  save(req, res, next) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: 'execution',
        quality: 'save',
      },
      payload: req.body,
    };
    const context = this.cementHelper.createContext(data);
    context.publish();
    context.on('done', function(response) {
      res.send(response);
    });
  }
}

module.exports = ExecutionsHandler;
