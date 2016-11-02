'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/result/helpers/', 'create.js');
let Helper = require(pathToHelper);
const pathToResult = nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'result.js');
const Result = require(pathToResult);

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

describe('BusinessLogics - Result - Create - _process', function() {
  let helper;
  context('when everything ok', function() {
    const inputJOB = {
      id: 'FOOBAR', // id generated by cta-io brick
      nature: {
        type: 'result',
        quality: Helper.name.toLowerCase(),
      },
      payload: {},
    };
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, inputJOB);
    let insertContext;
    let insertJOB;
    let UpdateExecutionResultsContext;
    let UpdateExecutionResultsJob;
    before(function() {
      sinon.stub(mockInputContext, 'emit');

      const mockResult = new Result({
        id: 'foo',
        executionId: 'foobar',
        scenarioId: 'bar',
        userId: 'quz',
        requestTimestamp: 1231923018230123,
        instances: [],
      });
      const StubResultConstructor = sinon.stub().returns(mockResult);
      requireSubvert.subvert(pathToResult, StubResultConstructor);
      Helper = requireSubvert.require(pathToHelper);

      insertJOB = {
        nature: {
          type: 'dbInterface',
          quality: 'insertOne',
        },
        payload: {
          type: 'result',
          content: mockResult,
        },
      };
      insertContext = new Context(DEFAULTCEMENTHELPER, insertJOB);
      insertContext.publish = sinon.stub();

      UpdateExecutionResultsJob = {
        nature: {
          type: 'execution',
          quality: 'updateResult',
        },
        payload: {
          executionId: mockResult.executionId,
        },
      };
      UpdateExecutionResultsContext = new Context(DEFAULTCEMENTHELPER, UpdateExecutionResultsJob);
      UpdateExecutionResultsContext.publish = sinon.stub();

      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
      sinon.stub(helper, '_ack');
      sinon.stub(helper.cementHelper, 'createContext')
        .onFirstCall()
        .returns(insertContext)
        .onSecondCall()
        .returns(UpdateExecutionResultsContext);

      helper._process(mockInputContext);
    });
    after(function() {
      requireSubvert.cleanUp();
      helper.cementHelper.createContext.restore();
      helper._ack.restore();
    });

    it('should send a new Context insertOne', function() {
      sinon.assert.calledWith(helper.cementHelper.createContext, insertJOB);
      sinon.assert.called(insertContext.publish);
    });

    it('should ack the Context', function() {
      sinon.assert.calledWith(helper._ack, mockInputContext);
    });

    context('when outputContext emits done event', function() {
      const response = {};
      before(function() {
        insertContext.emit('done', 'dblayer', response);
      });

      it('should emit done event on inputContext', function() {
        sinon.assert.calledWith(mockInputContext.emit,
          'done', helper.cementHelper.brickName, response);
      });

      it('should publish updateResult context', function() {
        sinon.assert.calledWith(helper.cementHelper.createContext, UpdateExecutionResultsJob);
        sinon.assert.called(UpdateExecutionResultsContext.publish);
      });
    });

    context('when outputContext emits reject event', function() {
      it('should emit reject event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        insertContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when outputContext emits error event', function() {
      it('should emit error event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        insertContext.emit('error', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
