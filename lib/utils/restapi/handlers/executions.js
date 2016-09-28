'use strict';
const _ = require('lodash');
const Execution = require('../../datamodels/execution.js');

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
  create(req, res) {
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
  update(req, res) {
    const data = {
      nature: {
        type: this.dataType,
        quality: 'update',
      },
      payload: req.body,
    };
    data.payload.id = req.params.id;
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
  findById(req, res) {
    const data = {
      nature: {
        type: this.dataType,
        quality: 'findById',
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
  delete(req, res) {
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

  /**
   * Publishes request params (Query) in an execution-find Context
   * @param req
   * @param res
   * @param next
   */
  find(req, res) {
    // computing filters
    const filter = {};
    // computing limit filter Number
    filter.limit = parseInt(req.query.limit, 10) || 20;
    // computing offset filter Number
    filter.offset = parseInt(req.query.offset, 10) || 0;
    // computing sort filter Object
    // Note: sort Object fields must be preserved in the right order
    // theorically, the JS standard defines Object as an unordered collection of properties
    // practically, v8 engine (and hence nodejs) preserves the order
    // so the following code is suitable
    if (req.query.hasOwnProperty('sort')) {
      filter.sort = {};
      const split = req.query.sort.split(',')
        .filter((str) => (str.length > 0));
      split.forEach(function(sortValue) {
        if (sortValue.startsWith('-')) {
          filter.sort[sortValue.substr(1)] = -1;
        } else {
          filter.sort[sortValue] = 1;
        }
      });
    }

    const query = Execution.convertQueryStrings(_.omit(req.query, Object.keys(filter)));
    const data = {
      nature: {
        type: this.dataType,
        quality: 'find',
      },
      payload: {
        filter: filter,
        query: query,
      },
    };
    const context = this.cementHelper.createContext(data);
    context.once('done', function(brickname, response) {
      res.send(response);
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
