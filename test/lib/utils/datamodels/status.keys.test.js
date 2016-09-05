'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'status.js'));

describe('BusinessLogics - Status - Model - Status - Keys', function() {
  context('when everything ok', function() {
    it('should return properties', function() {
      const keys = {
        id: { type: 'objectid' },
        executionId: { type: 'objectid' },
        scenarioId: { type: 'objectid' },
        configurationId: { type: 'objectid' },
        testsuiteId: { type: 'objectid' },
        testId: { type: 'objectid' },
        timestamp: { type: 'number', optional: true },
        parent: { type: 'objectid', optional: true },
        status: { type: 'string', optional: true },
        ip: { type: 'string', optional: true },
        hostname: { type: 'string', optional: true },
        type: { type: 'string', optional: true },
        name: { type: 'string', optional: true },
        description: { type: 'string', optional: true },
        custom: { type: 'object', optional: true },
      };
      expect(_.isEqual(Model.keys(), keys)).to.be.equal(true);
    });
  });
});
