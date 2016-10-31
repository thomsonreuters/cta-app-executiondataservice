'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const nodeUrl = require('url');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/helpers/', 'cancel.js');
let Helper = require(pathToHelper);
const pathToExecution = nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'execution.js');
const Execution = require(pathToExecution);

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

describe('BusinessLogics - Execution - Cancel - _process', function() {
  let helper;
  context('when everything ok', function() {
    let inputJOB;
    let mockInputContext;
    let mockFindContext;
    let findJob;
    let mockRequestContext;
    let requestJob;
    let mockExecution;
    before(function() {
      mockExecution = new Execution({
        id: (new ObjectID()).toString(),
        scenarioId: 'bar',
        userId: 'quz',
        startTimestamp: 1231923018230123,
        instances: [],
        pendingTimeout: 1000,
        state: 'pending',
      });

      inputJOB = {
        nature: {
          type: 'execution',
          quality: Helper.name.toLowerCase(),
        },
        payload: {
          id: mockExecution.id,
        },
      };
      mockInputContext = new Context(DEFAULTCEMENTHELPER, inputJOB);
      sinon.stub(mockInputContext, 'emit');

      const StubExecutionConstructor = sinon.stub().returns(mockExecution);
      requireSubvert.subvert(pathToExecution, StubExecutionConstructor);
      Helper = requireSubvert.require(pathToHelper);
      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, DEFAULTAPIURLS);

      findJob = {
        nature: {
          type: 'dbInterface',
          quality: 'findById',
        },
        payload: {
          type: 'execution',
          id: mockExecution.id,
        },
      };
      mockFindContext = new Context(DEFAULTCEMENTHELPER, findJob);
      mockFindContext.publish = sinon.stub();

      requestJob = {
        nature: {
          type: 'request',
          quality: 'post',
        },
        payload: {
          url: nodeUrl.resolve(
            helper.jobManagerApiUrl, `/executions/${mockExecution.id}/actions`),
          body: {
            action: 'cancel',
            state: mockExecution.state,
            instances: mockExecution.instances,
          },
        },
      };
      mockRequestContext = new Context(DEFAULTCEMENTHELPER, findJob);
      mockRequestContext.publish = sinon.stub();

      sinon.stub(helper.cementHelper, 'createContext')
        .withArgs(findJob)
        .returns(mockFindContext)
        .withArgs(requestJob)
        .returns(mockRequestContext);
      helper._process(mockInputContext);
    });
    after(function() {
      requireSubvert.cleanUp();
      helper.cementHelper.createContext.restore();
    });

    it('should send a new Context findById', function() {
      sinon.assert.calledWith(helper.cementHelper.createContext, findJob);
      sinon.assert.called(mockFindContext.publish);
    });

    context('when findContext emits done event', function() {
      context('when execution is not found', function() {
        before(function() {
          mockFindContext.emit('done', 'dblayer', null);
        });

        it('should emit not-found event on inputContext', function() {
          sinon.assert.calledWith(mockInputContext.emit,
            'not-found', helper.cementHelper.brickName);
        });
      });

      context('when execution is found', function() {
        before(function() {
          mockFindContext.emit('done', 'dblayer', mockExecution);
        });

        it('should send a new Context request', function() {
          sinon.assert.calledWith(helper.cementHelper.createContext, requestJob);
          sinon.assert.called(mockRequestContext.publish);
        });

        context('when requestContext emits done event', function() {
          const reqResponse = {};
          before(function() {
            mockRequestContext.emit('done', 'request', reqResponse);
          });

          it('should emit done event on inputContext', function() {
            sinon.assert.calledWith(mockInputContext.emit,
              'done', helper.cementHelper.brickName, reqResponse);
          });
        });

        context('when requestContext emits reject event', function() {
          it('should emit reject event on inputContext', function() {
            const error = new Error('mockError');
            const brickName = 'request';
            mockRequestContext.emit('reject', brickName, error);
            sinon.assert.calledWith(mockInputContext.emit,
              'reject', brickName, error);
          });
        });

        context('when requestContext emits error event', function() {
          it('should emit error event on inputContext', function() {
            const error = new Error('mockError');
            const brickName = 'request';
            mockRequestContext.emit('error', brickName, error);
            sinon.assert.calledWith(mockInputContext.emit,
              'error', brickName, error);
          });
        });
      });
    });

    context('when outputContext emits reject event', function() {
      it('should emit reject event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        mockFindContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when outputContext emits error event', function() {
      it('should emit error event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        mockFindContext.emit('error', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
