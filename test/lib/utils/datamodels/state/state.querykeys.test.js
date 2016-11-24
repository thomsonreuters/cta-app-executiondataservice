'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'state.js'));

describe('Data Model - State - QueryKeys', function() {
  context('when everything ok', function() {
    it('should return properties', function() {
      const keys = {
        id: { type: 'identifier', optional: true },
        executionId: { type: 'identifier', optional: true },
        testSuiteId: { type: 'identifier', optional: true },
        testId: { type: 'identifier', optional: true },
        timestamp: { type: 'number', optional: true },
        status: { type: 'string', optional: true },
        message: { type: 'string', optional: true },
        ip: { type: 'string', optional: true },
        hostname: { type: 'string', optional: true },
        index: { type: 'number', optional: true },
      };
      expect(_.isEqual(Model.queryKeys(), keys)).to.be.equal(true);
    });
  });
});
