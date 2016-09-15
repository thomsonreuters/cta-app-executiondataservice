'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
// const validate = require('cta-common').validate;
const schemas = {
  execution: require('../schemas/execution.js'), // eslint-disable-line global-require
  status: require('../schemas/status.js'), // eslint-disable-line global-require
  state: require('../schemas/state.js'), // eslint-disable-line global-require
};

/**
 * Database Interface MongoDB Helper GetStatusesCount class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class GetStatusesCount extends BaseDBInterfaceHelper {

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
    const mongoDbCollection = 'status';
    const mongoDbMatch = new schemas[mongoDbCollection](payload.query);

    const countJob = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'count',
        args: [
          mongoDbMatch,
        ],
      },
    };
    const countContext = this.cementHelper.createContext(countJob);
    countContext.publish();
    countContext.on('done', function(brickNameTwo, countResponse) {
      const mongoDbPipeline = [
        {
          $match: mongoDbMatch,
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: '$testId',
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
        const statuses = {
          ok: 0,
          failed: 0,
          partial: 0,
          inconclusive: 0,
        };
        aggregateResponse.forEach(function(status) {
          statuses[status.status] = status.count;
        });
        const response = {
          statusesCount: statuses,
          totalCount: countResponse,
        };
        context.emit('done', that.cementHelper.brickName, response);
      });
      aggregateContext.on('reject', function(brickname, error) {
        context.emit('reject', brickname, error);
      });
      aggregateContext.on('error', function(brickname, error) {
        context.emit('error', brickname, error);
      });
      aggregateContext.publish();
    });
    countContext.on('reject', function(brickNameTwo, error) {
      context.emit('reject', brickNameTwo, error);
    });
    countContext.on('error', function(brickNameTwo, error) {
      context.emit('error', brickNameTwo, error);
    });
  }
}

module.exports = GetStatusesCount;
