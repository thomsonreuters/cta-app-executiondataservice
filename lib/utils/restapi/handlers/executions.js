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
        quality: 'create',
      },
      payload: req.body,
    };
    if (req.body.hasOwnProperty('id')) {
      data.nature.quality = 'update';
    }
    const context = this.cementHelper.createContext(data);
    context.publish();
    context.on('done', function(brickname, response) {
      if (response) {
        res.send(response);
      } else {
        res.status(404).send('Execution not found.');
      }
    });
    context.once('reject', function(brickname, error) {
      res.status(400).send(error.message);
    });
    context.once('error', function(brickname, error) {
      res.status(400).send(error.message);
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
        quality: 'findbyid',
      },
      payload: {
        id: req.params.id,
      },
    };
    const context = this.cementHelper.createContext(data);
    context.once('done', function(brickname, response) {
      if (response) {
        res.send(response);
      } else {
        res.status(404).send('Execution not found.');
      }
    });
    context.once('reject', function(brickname, error) {
      res.status(400).send(error.message);
    });
    context.once('error', function(brickname, error) {
      res.status(400).send(error.message);
    });
    context.publish();
  }
}

module.exports = ExecutionsHandler;
