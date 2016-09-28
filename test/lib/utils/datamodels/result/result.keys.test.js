'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'result.js'));

describe('Data Model - Result - Keys', function() {
  context('when everything ok', function() {
    it('should return properties', function() {
      const keys = {
        id: { type: 'identifier' },
        executionId: { type: 'identifier' },
        // scenarioId: { type: 'identifier' },
        // configurationId: { type: 'identifier' },
        // testsuiteId: { type: 'identifier' },
        testId: { type: 'identifier' },
        status: { type: 'string' },
        timestamp: { type: 'number', optional: true },
        // parentId: { type: 'identifier', optional: true },
        ip: { type: 'string', optional: true },
        hostname: { type: 'string', optional: true },
        type: { type: 'string', optional: true },
        name: { type: 'string', optional: true },
        description: { type: 'string', optional: true },
        custom: { type: 'object', optional: true },
        index: { type: 'number', optional: true },
      };
      expect(_.isEqual(Model.keys(), keys)).to.be.equal(true);
    });
  });
});