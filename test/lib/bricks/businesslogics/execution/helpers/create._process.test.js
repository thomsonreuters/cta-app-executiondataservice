'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const nodeUrl = require('url');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/helpers/', 'create.js');
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

describe('BusinessLogics - Execution - Create - _process', function() {
  let helper;
  context('when everything ok', function() {
    const inputJOB = {
      nature: {
        type: 'execution',
        quality: Helper.name.toLowerCase(),
      },
      payload: {},
    };
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, inputJOB);
    let insertExecutionContext;
    let insertExecutionJob;
    let createScheduleContext;
    let createScheduleJob;
    let updateExecutionContext;
    let updateExecutionJob;
    let mockExecution;
    let mockSchedule;
    before(function() {
      sinon.stub(mockInputContext, 'emit');
      const now = Date.now();
      sinon.stub(Date, 'now').returns(now);

      mockExecution = new Execution({
        id: (new ObjectID()).toString(),
        scenarioId: 'bar',
        userId: 'quz',
        requestTimestamp: 1231923018230123,
        instances: [],
        pendingTimeout: 1000,
      });
      const StubExecutionConstructor = sinon.stub().returns(mockExecution);
      requireSubvert.subvert(pathToExecution, StubExecutionConstructor);
      Helper = requireSubvert.require(pathToHelper);
      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, DEFAULTAPIURLS);

      insertExecutionJob = {
        nature: {
          type: 'dbInterface',
          quality: 'insertOne',
        },
        payload: {
          type: 'execution',
          content: mockExecution,
        },
      };
      insertExecutionContext = new Context(DEFAULTCEMENTHELPER, insertExecutionJob);
      insertExecutionContext.publish = sinon.stub();

      const pendingTimestamp = mockExecution.requestTimestamp + mockExecution.pendingTimeout;
      createScheduleJob = {
        nature: {
          type: 'request',
          quality: 'post',
        },
        payload: {
          url: nodeUrl.resolve(helper.schedulerApiUrl, '/sch/schedules'),
          body: {
            schedule: pendingTimestamp,
            rest: {
              url: nodeUrl.resolve(helper.executionApiUrl,
                `/executions/${mockExecution.id}/actions`),
              method: 'POST',
              headers: {},
              body: {
                action: 'timeout',
              },
            },
            enabled: true,
          },
        },
      };
      createScheduleContext = new Context(DEFAULTCEMENTHELPER, insertExecutionJob);
      createScheduleContext.publish = sinon.stub();
      mockSchedule = {
        id: (new ObjectID()).toString(),
      };

      updateExecutionJob = {
        nature: {
          type: 'dbInterface',
          quality: 'updateOne',
        },
        payload: {
          type: 'execution',
          id: mockExecution.id,
          content: {
            pendingTimeoutScheduleId: mockSchedule.id,
          },
        },
      };
      updateExecutionContext = new Context(DEFAULTCEMENTHELPER, updateExecutionJob);
      updateExecutionContext.publish = sinon.stub();

      sinon.stub(helper.cementHelper, 'createContext')
        .withArgs(insertExecutionJob)
        .returns(insertExecutionContext)
        .withArgs(createScheduleJob)
        .returns(createScheduleContext)
        .withArgs(updateExecutionJob)
        .returns(updateExecutionContext);
      helper._process(mockInputContext);
    });
    after(function() {
      requireSubvert.cleanUp();
      Date.now.restore();
      helper.cementHelper.createContext.restore();
    });

    it('should send a new insertExecutionContext', function() {
      sinon.assert.calledWith(helper.cementHelper.createContext, insertExecutionJob);
      sinon.assert.called(insertExecutionContext.publish);
    });

    context('when insertExecutionContext emits done event', function() {
      before(function() {
        insertExecutionContext.emit('done', 'dblayer', mockExecution);
      });

      it('should send a new createScheduleContext', function() {
        sinon.assert.calledWith(helper.cementHelper.createContext, createScheduleJob);
        sinon.assert.called(createScheduleContext.publish);
      });

      context('when createScheduleContext emits done event', function() {
        before(function() {
          createScheduleContext.emit('done', 'request', {
            data: mockSchedule,
          });
        });

        it('should send a new updateExecutionContext', function() {
          sinon.assert.calledWith(helper.cementHelper.createContext, updateExecutionJob);
          sinon.assert.called(updateExecutionContext.publish);
        });

        context('when updateExecutionContext emits done event', function() {
          let updateExecution;
          before(function() {
            updateExecution = _.cloneDeep(mockExecution);
            updateExecution.pendingTimeoutScheduleId = mockSchedule.id;
            updateExecutionContext.emit('done', 'request', updateExecution);
          });

          it('should emit done event on inputContext', function() {
            sinon.assert.calledWith(mockInputContext.emit,
              'done', helper.cementHelper.brickName, updateExecution);
          });
        });

        context('when updateExecutionContext emits reject event', function() {
          it('should emit reject event on inputContext', function() {
            const error = new Error('mockError');
            const brickName = 'dblayer';
            updateExecutionContext.emit('reject', brickName, error);
            sinon.assert.calledWith(mockInputContext.emit,
              'reject', brickName, error);
          });
        });

        context('when updateExecutionContext emits error event', function() {
          it('should emit error event on inputContext', function() {
            const error = new Error('mockError');
            const brickName = 'dblayer';
            updateExecutionContext.emit('error', brickName, error);
            sinon.assert.calledWith(mockInputContext.emit,
              'error', brickName, error);
          });
        });
      });

      context('when createScheduleContext emits reject event', function() {
        it('should emit reject event on inputContext', function() {
          const error = new Error('mockError');
          const brickName = 'request';
          createScheduleContext.emit('reject', brickName, error);
          sinon.assert.calledWith(mockInputContext.emit,
            'reject', brickName, error);
        });
      });

      context('when createScheduleContext emits error event', function() {
        it('should emit error event on inputContext', function() {
          const error = new Error('mockError');
          const brickName = 'request';
          createScheduleContext.emit('error', brickName, error);
          sinon.assert.calledWith(mockInputContext.emit,
            'error', brickName, error);
        });
      });
    });

    context('when outputContext emits reject event', function() {
      it('should emit reject event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        insertExecutionContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when outputContext emits error event', function() {
      it('should emit error event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        insertExecutionContext.emit('error', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
