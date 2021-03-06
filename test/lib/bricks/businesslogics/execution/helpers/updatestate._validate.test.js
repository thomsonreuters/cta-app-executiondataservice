'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const Helper = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/executions/helpers', 'updatestate.js'));

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
  executionApiUrl: 'http://localhost:3010/eds/',
  schedulerApiUrl: 'http://localhost:3011/sch/',
  jobManagerApiUrl: 'http://localhost:3012/jms/',
};
const DATA = require('./updatestate._process.testdata.js');

describe('BusinessLogics - Execution - UpdateState - _validate', function() {
  let helper;
  const DEFAULTINPUTJOB = DATA.job;
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, DEFAULTAPIURLS);
  });
  context('when everything ok', function() {
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, DEFAULTINPUTJOB);
    let promise;
    before(function() {
      promise = helper._validate(mockInputContext);
    });
    after(function() {
    });
    it('should resolve', function() {
      return expect(promise).to.eventually.have.property('ok', 1);
    });
  });

  context('when payload.id is not a String', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.executionId = {};
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'missing/incorrect \'executionId\' identifier in job payload');
    });
  });

  context('when payload.id is not a String value of ObjectID', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.executionId = 'sdfsdf';
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'missing/incorrect \'executionId\' identifier in job payload');
    });
  });
});
