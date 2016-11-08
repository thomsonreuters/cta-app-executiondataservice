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
const DEFAULTAPIURLS = {
  executionApiUrl: 'http://localhost:3010/',
  schedulerApiUrl: 'http://localhost:3011/',
  jobManagerApiUrl: 'http://localhost:3012/',
};

describe('BusinessLogics - Execution - UpdateState - _getExecutionUpdatedFields', function() { // eslint-disable-line max-len
  let helper;
  const now = Date.now();
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, DEFAULTAPIURLS);
    sinon.stub(Date, 'now').returns(now);
  });
  after(function() {
    Date.now.restore();
  });
  context('when execution result should be pending', function() {
    const counts = {
      pending: 4,
      running: 3,
      finished: 1,
      acked: 0,
      canceled: 1,
      timeout: 1,
    };
    const commandsCounts = 4;
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts, commandsCounts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('state', 'pending');
      expect(result).to.have.property('updateTimestamp', now);
    });
  });
  context('when execution result should be canceled', function() {
    const counts = {
      pending: 4,
      running: 4,
      finished: 2,
      acked: 0,
      canceled: 1,
      timeout: 1,
    };
    const commandsCounts = 4;
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts, commandsCounts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('state', 'canceled');
      expect(result).to.have.property('updateTimestamp', now);
    });
  });
  context('when execution result should be timeout', function() {
    const counts = {
      pending: 4,
      running: 4,
      finished: 3,
      acked: 0,
      canceled: 0,
      timeout: 1,
    };
    const commandsCounts = 4;
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts, commandsCounts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('state', 'timeout');
      expect(result).to.have.property('updateTimestamp', now);
    });
  });
  context('when execution result should be finished', function() {
    const counts = {
      pending: 4,
      running: 2,
      finished: 4,
      acked: 3,
      canceled: 0,
      timeout: 0,
    };
    const commandsCounts = 4;
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts, commandsCounts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('state', 'finished');
      expect(result).to.have.property('updateTimestamp', now);
    });
  });
  context('when execution result should be running', function() {
    const counts = {
      pending: 4,
      running: 4,
      finished: 1,
      acked: 0,
      canceled: 1,
      timeout: 1,
    };
    const commandsCounts = 4;
    let result;
    before(function() {
      result = helper._getExecutionUpdatedFields(counts, commandsCounts);
    });

    it('should return execution update fields', function() {
      expect(result).to.have.property('state', 'running');
      expect(result).to.have.property('updateTimestamp', now);
    });
  });
});
