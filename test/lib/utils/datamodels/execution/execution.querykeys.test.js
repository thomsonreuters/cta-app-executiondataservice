'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'executions.js'));

describe('Data Model - Execution - QueryKeys', function() {
  context('when everything ok', function() {
    it('should return properties', function() {
      const keys = {
        id: { type: 'identifier', optional: true },
        // references to other objects
        scenarioId: { type: 'identifier', optional: true },
        userId: { type: 'identifier', optional: true },
        // timestamps related fields
        requestTimestamp: { type: 'number', optional: true },
        updateTimestamp: { type: 'number', optional: true },
        completeTimestamp: { type: 'number', optional: true },
        // timeouts related fields
        pendingTimeout: { type: 'number', optional: true },
        runningTimeout: { type: 'number', optional: true },
        pendingTimeoutScheduleId: { type: 'identifier', optional: true },
        // results related fields
        result: { type: 'string', optional: true },
        ok: { type: 'number', optional: true },
        partial: { type: 'number', optional: true },
        inconclusive: { type: 'number', optional: true },
        failed: { type: 'number', optional: true },
        resultsCount: { type: 'number', optional: true },
        // states related fields
        instances: { type: 'array', optional: true },
        commandsCount: { type: 'number', optional: true },
        state: { type: 'string', optional: true },
        cancelDetails: { type: 'object', optional: true },
      };
      expect(_.isEqual(Model.queryKeys(), keys)).to.be.equal(true);
    });
  });
});
