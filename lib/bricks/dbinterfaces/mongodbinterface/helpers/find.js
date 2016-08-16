'use strict';
const BaseDBInterfaceHelper = require('../../basedbinterface/basehelper.js');
const _ = require('lodash');
const ObjectID = require('bson').ObjectID;

/**
 * Database Interface MongoDB Helper Find class
 *
 * @augments BaseDBInterfaceHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Find extends BaseDBInterfaceHelper {

  /**
   * Validates Context properties specific to this Helper
   * Validates abstract query fields
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) { // eslint-disable-line no-unused-vars
    const job = context.data;
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      if (!job.payload.hasOwnProperty('type') || typeof job.payload.type !== 'string') {
        reject(new Error('missing/incorrect \'type\' String in job payload'));
      }

      if (!job.payload.hasOwnProperty('query')
        || typeof job.payload.query !== 'object'
        || job.payload.query === null) {
        reject(new Error('missing/incorrect \'query\' Object in job payload'));
      }
      resolve({ ok: 1 });
    });
  }

  /**
   * Process the context
   * @param {Context} context - a Context
   */
  _process(context) {
    const that = this;
    const mongoDbCollection = context.data.payload.type;

    // todo: convert CTA Query to mongoDB query
    const mongoDbQuery = _.cloneDeep(context.data.payload.query);
    if (mongoDbQuery.hasOwnProperty('id')) {
      mongoDbQuery._id = new ObjectID(context.data.payload.query.id);
      delete mongoDbQuery.id;
    }

    const data = {
      nature: {
        type: 'database',
        quality: 'query',
      },
      payload: {
        collection: mongoDbCollection,
        action: 'find',
        args: [
          mongoDbQuery,
        ],
      },
    };
    const output = this.cementHelper.createContext(data);
    output.publish();
    output.on('done', function(brickname, response) {
      if (Array.isArray(response)) {
        const result = response; // todo: convert mongoDB documents to CTA Model
        context.emit('done', that.cementHelper.brickName, result);
      }
    });
  }
}

module.exports = Find;
