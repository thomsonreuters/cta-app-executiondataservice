'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
const nodepath = require('path');

const Logger = require('cta-logger');
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/helpers/', 'updatestatusescount.js');
const Helper = require(pathToHelper);

const DEFAULTCONFIG = require('../index.config.testdata.js');
const DEFAULTLOGGER = new Logger(null, null, DEFAULTCONFIG.name);
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: DEFAULTCONFIG.name,
  dependencies: {
    logger: DEFAULTLOGGER,
  },
  createContext: function() {},
};

describe('BusinessLogics - Execution - UpdateStatus - _getExecutionUpdatedFields', function() { // eslint-disable-line max-len
  let helper;
  const now = Date.now();
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
    sinon.stub(Date, 'now').returns(now);
  });
  after(function() {
    Date.now.restore();
  });
  context('when execution status should be failed', function() {
    const counts = {
      statusesCount: {
        failed: 1,
        partial: 1,
        inconclusive: 1,
        ok: 1,
      },
      totalCount: 4,
    };
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('nbstatuses', 4);
      expect(result).to.have.property('failed', 1);
      expect(result).to.have.property('partial', 1);
      expect(result).to.have.property('inconclusive', 1);
      expect(result).to.have.property('ok', 1);
      expect(result).to.have.property('status', 'failed');
      expect(result).to.have.property('updatetimestamp', now);
    });
  });
  context('when execution status should be partial', function() {
    const counts = {
      statusesCount: {
        failed: 0,
        partial: 1,
        inconclusive: 1,
        ok: 1,
      },
      totalCount: 3,
    };
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('nbstatuses', 3);
      expect(result).to.have.property('failed', 0);
      expect(result).to.have.property('partial', 1);
      expect(result).to.have.property('inconclusive', 1);
      expect(result).to.have.property('ok', 1);
      expect(result).to.have.property('status', 'partial');
      expect(result).to.have.property('updatetimestamp', now);
    });
  });
  context('when execution status should be inconclusive', function() {
    const counts = {
      statusesCount: {
        failed: 0,
        partial: 0,
        inconclusive: 1,
        ok: 1,
      },
      totalCount: 2,
    };
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('nbstatuses', 2);
      expect(result).to.have.property('failed', 0);
      expect(result).to.have.property('partial', 0);
      expect(result).to.have.property('inconclusive', 1);
      expect(result).to.have.property('ok', 1);
      expect(result).to.have.property('status', 'inconclusive');
      expect(result).to.have.property('updatetimestamp', now);
    });
  });
  context('when execution status should be ok', function() {
    const counts = {
      statusesCount: {
        failed: 0,
        partial: 0,
        inconclusive: 0,
        ok: 1,
      },
      totalCount: 1,
    };
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('nbstatuses', 1);
      expect(result).to.have.property('failed', 0);
      expect(result).to.have.property('partial', 0);
      expect(result).to.have.property('inconclusive', 0);
      expect(result).to.have.property('ok', 1);
      expect(result).to.have.property('status', 'ok');
      expect(result).to.have.property('updatetimestamp', now);
    });
  });
});
