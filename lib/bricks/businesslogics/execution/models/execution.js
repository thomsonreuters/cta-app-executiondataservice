'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const properties = {
  id: 'string',
  scenarioId: 'string',
  userId: 'string',
  starttimestamp: 'number',
  updatetimestamp: 'number',
  state: 'string',
  cancel: 'object',
  status: 'string',
  ok: 'number',
  partial: 'number',
  inconclusive: 'number',
  failed: 'number',
  nbstatuses: 'number',
  done: 'boolean',
  instances: 'array',
};
/**
 * Execution Data Model class
 *
 * @property {ObjectID} id - unique identifier
 * @property {ObjectID} scenario - unique identifier of a Scenario
 * @property {ObjectID} configuration - unique identifier of a Configuration
 * @property {ObjectID} user - unique identifier of an User
 */
class Execution {
  /**
   *
   * @param {Object} data - params
   * @param {ObjectID} data.id - unique identifier
   * @param {ObjectID} data.scenario - unique identifier of a Scenario
   * @param {ObjectID} data.configuration - unique identifier of a Configuration
   * @param {ObjectID} data.user - unique identifier of an User
   */
  constructor(data) {
    this.id = data.id || (new ObjectID()).toString();
    this.scenarioId = data.scenarioId;
    this.userId = data.userId;
    this.starttimestamp = data.starttimestamp;
    this.updatetimestamp = data.updatetimestamp;
    this.state = data.state;
    this.cancel = data.cancel;
    this.status = data.status;
    this.ok = data.ok;
    this.partial = data.partial;
    this.inconclusive = data.inconclusive;
    this.failed = data.failed;
    this.nbstatuses = data.nbstatuses;
    this.done = data.done;
    this.instances = data.instances;
  }

  static validate(data) {
    return { ok: 1 };
  }

  toJSON() {
    const jsonObject = _.pick(this, Object.keys(properties));
    return _.omitBy(jsonObject, _.isNil);
  }
}

module.exports = Execution;
