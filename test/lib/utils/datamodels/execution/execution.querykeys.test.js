'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'execution.js'));

describe('Data Model - Execution - QueryKeys', function() {
  context('when everything ok', function() {
    it('should return properties', function() {
      const keys = {
        id: { type: 'identifier', optional: true },
        // references to other objects
        scenarioId: { type: 'identifier', optional: true },
        userId: { type: 'identifier', optional: true },
        // timestamps related fields
        starttimestamp: { type: 'number', optional: true },
        updatetimestamp: { type: 'number', optional: true },
        // results related fields
        result: { type: 'string', optional: true },
        ok: { type: 'number', optional: true },
        partial: { type: 'number', optional: true },
        inconclusive: { type: 'number', optional: true },
        failed: { type: 'number', optional: true },
        nbresults: { type: 'number', optional: true },
        // states related fields
        instances: { type: 'array', optional: true },
        commandcount: { type: 'number', optional: true },
        state: { type: 'string', optional: true },
        canceldetails: { type: 'object', optional: true },
        completed: { type: 'boolean', optional: true },
      };
      expect(_.isEqual(Model.queryKeys(), keys)).to.be.equal(true);
    });
  });
});
