'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
// const validate = require('cta-common').validate;
const schemas = {
  executions: require('../schemas/executions.js'), // eslint-disable-line global-require
  results: require('../schemas/results.js'), // eslint-disable-line global-require
  states: require('../schemas/states.js'), // eslint-disable-line global-require
};

/**
 * Database Interface MongoDB Helper GetResultsCount class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class GetResultsCount extends BaseDBInterfaceHelper {

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
    const mongoDbCollection = 'results';
    const mongoDbMatch = new schemas[mongoDbCollection](payload.query);
    const mongoDbPipeline = [
      {
        $match: mongoDbMatch,
      },
      {
        $sort: { index: -1 },
      },
      {
        $group: {
          _id: { testId: '$testId', hostname: '$hostname' },
          doc: { $first: '$$ROOT' },
        },
      },
      {
        $group: {
          _id: '$doc.status',
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
      const results = {
        ok: 0,
        failed: 0,
        partial: 0,
        inconclusive: 0,
      };
      aggregateResponse.forEach(function(result) {
        results[result.status] = result.count;
      });
      context.emit('done', that.cementHelper.brickName, results);
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

module.exports = GetResultsCount;
