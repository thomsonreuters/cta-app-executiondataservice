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
   * Publishes request body (Execution) in an execution-save Context
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
    context.on('done', function(brickname, response) {
      res.send(response);
    });
  }

  /**
   * Publishes request params (Query) id in an execution-find Context
   * @param req
   * @param res
   * @param next
   */
  findById(req, res, next) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: 'execution',
        quality: 'find',
      },
      payload: {
        id: req.params.id,
      },
    };
    const context = this.cementHelper.createContext(data);
    context.publish();
    context.on('done', function(brickname, response) {
      if (Array.isArray(response) && response.length > 0) {
        res.send(response[0]);
      } else {
        res.status(404).send('Execution not found.');
      }
    });
  }
}

module.exports = ExecutionsHandler;
