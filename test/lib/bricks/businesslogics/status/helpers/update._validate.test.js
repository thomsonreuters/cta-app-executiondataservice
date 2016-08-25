'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const Helper = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/status/helpers', 'update.js'));

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

describe('BusinessLogics - Status - Update - _validate', function() {
  let helper;
  const mockId = new ObjectID();
  const DEFAULTINPUTJOB = {
    nature: {
      type: 'status',
      quality: 'update',
    },
    payload: {
      id: mockId.toString(),
      content: {},
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

  context('when payload.id is not a String', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.id = {};
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    before(function() {
      sinon.spy(helper, '_ack');
    });
    after(function() {
      helper._ack.restore();
    });
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      sinon.assert.calledWith(helper._ack, mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'missing/incorrect \'id\' String value of ObjectID in job payload');
    });
  });

  context('when payload.id is not a String value of ObjectID', function() {
    const job = _.cloneDeep(DEFAULTINPUTJOB);
    job.payload.id = 'sdfsdf';
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, job);
    before(function() {
      sinon.spy(helper, '_ack');
    });
    after(function() {
      helper._ack.restore();
    });
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      sinon.assert.calledWith(helper._ack, mockInputContext);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'missing/incorrect \'id\' String value of ObjectID in job payload');
    });
  });
});
