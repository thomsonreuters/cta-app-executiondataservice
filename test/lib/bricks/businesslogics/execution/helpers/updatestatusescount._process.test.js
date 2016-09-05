'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
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
const DATA = require('./updatestatusescount._process.testdata.js');

describe('BusinessLogics - Execution - UpdateStatusesCount - _process', function() {
  let helper;
  context('when everything ok', function() {
    const DEFAULTINPUTJOB = DATA.job;
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, DEFAULTINPUTJOB);

    const findExecutionJob = {
      nature: {
        type: 'dbinterface',
        quality: 'findbyid',
      },
      payload: {
        type: 'execution',
        id: DEFAULTINPUTJOB.payload.executionId,
      },
    };
    const findExecutionContext = new Context(DEFAULTCEMENTHELPER, findExecutionJob);
    findExecutionContext.publish = sinon.stub();

    const findStatusesJob = {
      nature: {
        type: 'dbinterface',
        quality: 'getstatusescount',
      },
      payload: {
        query: {
          executionid: DEFAULTINPUTJOB.payload.executionId,
        },
      },
    };
    const findStatusesContext = new Context(DEFAULTCEMENTHELPER, findStatusesJob);
    findStatusesContext.publish = sinon.stub();

    const updateExecutionJob = {
      nature: {
        type: 'dbinterface',
        quality: 'updateone',
      },
      payload: {
        type: 'execution',
        id: DEFAULTINPUTJOB.payload.executionid,
        content: DATA.statusesCount,
      },
    };
    const updateExecutionContext = new Context(DEFAULTCEMENTHELPER, updateExecutionJob);
    updateExecutionContext.publish = sinon.stub();

    before(function() {
      sinon.stub(mockInputContext, 'emit');

      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
      sinon.stub(helper.cementHelper, 'createContext')
        .onFirstCall()
        .returns(findExecutionContext)
        .onSecondCall()
        .returns(findStatusesContext)
        .onThirdCall()
        .returns(updateExecutionContext);
      helper._process(mockInputContext);
    });
    after(function() {
      requireSubvert.cleanUp();
      helper.cementHelper.createContext.restore();
    });

    it('should send a new Context find statuses', function() {
      sinon.assert.calledWith(helper.cementHelper.createContext, findExecutionJob);
      sinon.assert.called(findExecutionContext.publish);
    });

    context('when outputContext emits done event', function() {
      it('should emit done event on inputContext', function() {
        const execution = DATA.execution;
        const statusesCount = DATA.statusesCountProjection;
        const updatedExecution = _.cloneDeep(DATA.execution);
        findExecutionContext.emit('done', 'dblayer', execution);
        findStatusesContext.emit('done', 'dblayer', statusesCount);
        updateExecutionContext.emit('done', 'dblayer', updatedExecution);
        sinon.assert.calledWith(mockInputContext.emit,
          'done', helper.cementHelper.brickName, updatedExecution);
      });
    });

    context.skip('when outputContext emits reject event', function() {
      it('should emit reject event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbinterface';
        findStatusesContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context.skip('when outputContext emits error event', function() {
      it('should emit error event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbinterface';
        findStatusesContext.emit('error', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
