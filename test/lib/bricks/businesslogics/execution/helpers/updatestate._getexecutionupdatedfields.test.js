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
  '/lib/bricks/businesslogics/execution/helpers/', 'updatestate.js');
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

describe('BusinessLogics - Execution - UpdateState - _getExecutionUpdatedFields', function() { // eslint-disable-line max-len
  let helper;
  const now = Date.now();
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
    sinon.stub(Date, 'now').returns(now);
  });
  after(function() {
    Date.now.restore();
  });
  context('when execution status should be pending', function() {
    const counts = {
      pending: 1,
      running: 0,
      finished: 1,
      acked: 2,
    };
    const commandcounts = 4;
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts, commandcounts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('state', 'pending');
      expect(result).to.have.property('updatetimestamp', now);
    });
  });
  context('when execution status should be finished', function() {
    const counts = {
      pending: 0,
      running: 0,
      finished: 2,
      acked: 2,
    };
    const commandcounts = 4;
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts, commandcounts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('state', 'finished');
      expect(result).to.have.property('updatetimestamp', now);
    });
  });
  context('when execution status should be running', function() {
    const counts = {
      pending: 1,
      running: 1,
      finished: 3,
      acked: 2,
    };
    const commandcounts = 6;
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts, commandcounts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('state', 'running');
      expect(result).to.have.property('updatetimestamp', now);
    });
  });
});
