'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
// const validate = require('cta-common').validate;
const schemas = {
  executions: require('../schemas/executions.js'), // eslint-disable-line global-require
  results: require('../schemas/results.js'), // eslint-disable-line global-require
  states: require('../schemas/states.js'), // eslint-disable-line global-require
};

/**
 * Database Interface MongoDB Helper GetStatesCount class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class GetStatesCount extends BaseDBInterfaceHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates abstract query fields
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
   * @param {Context} context - a Context
   */
  _process(context) {
    const that = this;
    const payload = context.data.payload;
    const mongoDbCollection = 'states';
    const mongoDbMatch = new schemas[mongoDbCollection](payload.query);
    const mongoDbPipeline = [
      {
        $match: mongoDbMatch,
      },
      {
        $sort: payload.filter.sort,
      },
      {
        $skip: payload.filter.offset,
      },
      // {
      //   $limit: payload.filter.limit,
      // },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          status: '$_id',
        },
      },
    ];

    const aggregateJob = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'aggregate',
        args: [
          mongoDbPipeline,
        ],
      },
    };
    const aggregateContext = this.cementHelper.createContext(aggregateJob);
    aggregateContext.on('done', function(brickname, aggregateResponse) {
      const states = {
        pending: 0,
        running: 0,
        finished: 0,
        acked: 0,
        canceled: 0,
      };
      aggregateResponse.forEach(function(state) {
        states[state.status] = state.count;
      });
      context.emit('done', that.cementHelper.brickName, states);
    });
    aggregateContext.on('reject', function(brickname, error) {
      context.emit('reject', brickname, error);
    });
    aggregateContext.on('error', function(brickname, error) {
      context.emit('error', brickname, error);
    });
    aggregateContext.publish();
  }
}

module.exports = GetStatesCount;
