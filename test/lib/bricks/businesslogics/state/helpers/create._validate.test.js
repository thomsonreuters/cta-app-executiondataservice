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
  '/lib/bricks/businesslogics/states/helpers', 'create.js'));

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
const SAMPLE = require('./create.sample.testdata.js');

describe('BusinessLogics - State - Create - _validate', function() {
  let helper;
  const DEFAULTINPUTJOB = {
    nature: {
      type: 'states',
      quality: Helper.name.toLowerCase(),
    },
    payload: SAMPLE,
  };
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER,
      DEFAULTCONFIG.properties.instancesQueue);
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

  context('when payload is not an object', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload = 'not-an-object';
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually.be.rejected;
    });
  });

  context('when payload has an invalid parameter', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.id = 'not-an-objectid';
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually.be.rejected;
    });
  });
});
