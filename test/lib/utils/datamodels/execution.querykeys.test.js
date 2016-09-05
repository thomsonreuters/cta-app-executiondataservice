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
        scenarioId: { type: 'identifier', optional: true },
        userId: { type: 'identifier', optional: true },
        starttimestamp: { type: 'number', optional: true },
        updatetimestamp: { type: 'number', optional: true },
        state: { type: 'string', optional: true },
        cancel: { type: 'object', optional: true },
        status: { type: 'string', optional: true },
        ok: { type: 'number', optional: true },
        partial: { type: 'number', optional: true },
        inconclusive: { type: 'number', optional: true },
        failed: { type: 'number', optional: true },
        nbstatuses: { type: 'number', optional: true },
        done: { type: 'boolean', optional: true },
        instances: { type: 'array', optional: true },
      };
      expect(_.isEqual(Model.queryKeys(), keys)).to.be.equal(true);
    });
  });
});
