'use strict';
const _ = require('lodash');
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
// const validate = require('cta-common').validate;
const schemas = {
  execution: require('../schemas/execution.js'), // eslint-disable-line global-require
  result: require('../schemas/result.js'), // eslint-disable-line global-require
  state: require('../schemas/state.js'), // eslint-disable-line global-require
};

/**
 * Database Interface MongoDB Helper GetResultsIndex class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class GetResultsIndex extends BaseDBInterfaceHelper {

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
    const mongoDbCollection = 'result';
    const mongoDbMatch = new schemas[mongoDbCollection](payload.query);
    const mongoDbPipeline = [
      {
        $match: mongoDbMatch,
      },
      {
        $project: {
          hostname: 1,
          index: 1,
        },
      },
      {
        $group: {
          _id: '$hostname',
          idxcount: { $sum: 1 },
          minidx: { $min: '$index' },
          maxidx: { $max: '$index' },
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
      const reduce = aggregateResponse.reduce(function(map, obj) {
        const response = map;
        response[obj._id] = _.pick(obj, ['idxcount', 'minidx', 'maxidx']);
        return response;
      }, {});
      context.emit('done', that.cementHelper.brickName, reduce);
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

module.exports = GetResultsIndex;
