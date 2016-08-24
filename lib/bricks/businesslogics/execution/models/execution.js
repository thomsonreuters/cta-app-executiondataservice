'use strict';
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');
const validate = require('cta-common').validate;

const pattern = {
  type: 'object',
  items: {
    scenarioId: { type: 'objectid' },
    userId: { type: 'objectid' },
    starttimestamp: { type: 'number' },
    updatetimestamp: { type: 'number' },
    state: { type: 'string' },
    cancel: { type: 'object' },
    status: { type: 'string' },
    ok: { type: 'number' },
    partial: { type: 'number' },
    inconclusive: { type: 'number' },
    failed: { type: 'number' },
    nbstatuses: { type: 'number' },
    done: { type: 'boolean' },
    instances: { type: 'array' },
  },
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
}

module.exports = Execution;
