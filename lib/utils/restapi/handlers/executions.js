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
    this.dataType = 'execution';
  }

  /**
   * Publishes request body (Execution) in an execution-create Context
   * @param req
   * @param res
   * @param next
   */
  create(req, res, next) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: this.dataType,
        quality: 'create',
      },
      payload: req.body,
    };
    if (req.method.toLowerCase() === 'put' && !req.params.hasOwnProperty('id')) {
      res.status(400).send('Missing \'id\' property');
    } else {
      if (req.params.hasOwnProperty('id')) {
        data.payload.id = req.params.id;
      }
      const context = this.cementHelper.createContext(data);
      context.publish();
      context.on('done', function(brickname, response) {
        res.status(201).send(response);
      });
      context.once('reject', function(brickname, error) {
        res.status(400).send(error.message);
      });
      context.once('error', function(brickname, error) {
        res.status(400).send(error.message);
      });
    }
  }

  /**
   * Publishes request body (Execution) in an execution-update Context
   * @param req
   * @param res
   * @param next
   */
  update(req, res, next) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: this.dataType,
        quality: 'update',
      },
      payload: {
        id: req.params.id,
        content: req.body,
      },
    };
    // if (req.body.hasOwnProperty('id')) {
    //   data.nature.quality = 'update';
    // }
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
   * Publishes request params (Query) id in an execution-findbyid Context
   * @param req
   * @param res
   * @param next
   */
  findById(req, res, next) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: this.dataType,
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

  /**
   * Publishes request params (Query) id in an execution-deleteone Context
   * @param req
   * @param res
   * @param next
   */
  delete(req, res, next) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: this.dataType,
        quality: 'delete',
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
