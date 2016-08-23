'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const Helper = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/helpers', 'find.js'));

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

describe('BusinessLogics - Execution - Find - _validate', function() {
  let helper;
  const DEFAULTINPUTJOB = {
    nature: {
      type: 'execution',
      quality: 'find',
    },
    payload: {
      filter: {
        limit: 10,
        offset: 0,
        sort: {
          starttimestamp: -1,
          nbstatuses: 1,
        },
      },
      query: {
        foo: 'bar',
      },
    },
  };
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
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

  context('when payload.filter is not an Object', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.filter = '';
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'missing/incorrect \'filter\' Object in job payload');
    });
  });

  context('when payload.filter.limit is not a Number', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.filter.limit = '';
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'missing/incorrect \'limit\' Number in job payload.filter');
    });
  });

  context('when payload.filter.offset is not a Number', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.filter.offset = '';
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'missing/incorrect \'offset\' Number in job payload.filter');
    });
  });

  context('when payload.filter.sort is not an Object', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.filter.sort = null;
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'incorrect \'sort\' Object in job payload.filter');
    });
  });

  context('when payload.query is not an Object', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.query = '';
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'missing/incorrect \'query\' Object in job payload');
    });
  });
});
