'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/state/helpers/', 'create.js');
let Helper = require(pathToHelper);
const pathToState = nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'state.js');
const State = require(pathToState);

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

describe('BusinessLogics - State - Create - _process', function() {
  let helper;
  context('when everything ok', function() {
    const inputJOB = {
      id: 'FOOBAR', // id generated by cta-io brick
      nature: {
        type: 'state',
        quality: Helper.name.toLowerCase(),
      },
      payload: {},
    };
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, inputJOB);
    const mockState = new State({
      id: 'foo',
      executionId: 'foobar',
      timestamp: 1231923018230123,
      hostname: 'mymachine',
      status: 'running',
    });
    let insertContext;
    let insertJOB;
    let updateExecutionStatesContext;
    let updateExecutionStatesJOB;
    let sendInstanceDoneEventJob;
    let sendInstanceDoneEventContext;
    let sendInstanceStartEventJob;
    let sendInstanceStartEventContext;
    before(function() {
      sinon.stub(mockInputContext, 'emit');

      const StubStateConstructor = sinon.stub().returns(mockState);
      requireSubvert.subvert(pathToState, StubStateConstructor);
      Helper = requireSubvert.require(pathToHelper);

      insertJOB = {
        nature: {
          type: 'dbInterface',
          quality: 'insertOne',
        },
        payload: {
          type: 'state',
          content: mockState,
        },
      };
      insertContext = new Context(DEFAULTCEMENTHELPER, insertJOB);
      insertContext.publish = sinon.stub();

      updateExecutionStatesJOB = {
        nature: {
          type: 'execution',
          quality: 'updateState',
        },
        payload: {
          executionId: mockState.executionId,
        },
      };
      updateExecutionStatesContext = new Context(DEFAULTCEMENTHELPER, updateExecutionStatesJOB);
      updateExecutionStatesContext.publish = sinon.stub();

      sendInstanceDoneEventJob = {
        nature: {
          type: 'message',
          quality: 'produce',
        },
        payload: {
          queue: DEFAULTCONFIG.properties.instancesQueue,
          message: {
            nature: {
              type: 'instances',
              quality: 'update',
            },
            payload: {
              hostname: mockState.hostname,
              executionId: null,
              state: null,
            },
          },
        },
      };
      sendInstanceDoneEventContext = new Context(DEFAULTCEMENTHELPER, sendInstanceDoneEventJob);
      sendInstanceDoneEventContext.publish = sinon.stub();

      sendInstanceStartEventJob = {
        nature: {
          type: 'message',
          quality: 'produce',
        },
        payload: {
          queue: DEFAULTCONFIG.properties.instancesQueue,
          message: {
            nature: {
              type: 'instances',
              quality: 'update',
            },
            payload: {
              hostname: mockState.hostname,
              executionId: mockState.executionId,
              state: mockState.status,
            },
          },
        },
      };
      sendInstanceStartEventContext = new Context(DEFAULTCEMENTHELPER, sendInstanceDoneEventJob);
      sendInstanceStartEventContext.publish = sinon.stub();

      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER,
        DEFAULTCONFIG.properties.instancesQueue);
      sinon.stub(helper, '_ack');
      sinon.stub(helper.cementHelper, 'createContext')
        .withArgs(insertJOB)
        .returns(insertContext)
        .withArgs(updateExecutionStatesJOB)
        .returns(updateExecutionStatesContext)
        .withArgs(sendInstanceDoneEventJob)
        .returns(sendInstanceDoneEventContext)
        .withArgs(sendInstanceStartEventJob)
        .returns(sendInstanceStartEventContext);

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

    context('when insertContext emits done event', function() {
      context('common', function() {
        const response = _.cloneDeep(mockState);
        before(function() {
          insertContext.emit('done', 'dblayer', response);
        });

        it('should emit done event on inputContext', function() {
          sinon.assert.calledWith(mockInputContext.emit,
            'done', helper.cementHelper.brickName, response);
        });

        it('should publish UpdateExecutionStates context', function() {
          sinon.assert.calledWith(helper.cementHelper.createContext, updateExecutionStatesJOB);
          sinon.assert.called(updateExecutionStatesContext.publish);
        });
      });

      context('when state is finished, canceled or timeout', function() {
        const response = _.cloneDeep(mockState);
        response.status = 'finished';
        before(function() {
          insertContext.emit('done', 'dblayer', response);
        });

        it('should publish sendInstanceDoneEventContext context', function() {
          sinon.assert.calledWith(helper.cementHelper.createContext, sendInstanceDoneEventJob);
          sinon.assert.called(sendInstanceDoneEventContext.publish);
        });
      });

      context('when state is running', function() {
        const response = _.cloneDeep(mockState);
        response.status = 'running';
        before(function() {
          insertContext.emit('done', 'dblayer', response);
        });

        it('should publish sendInstanceStartEventContext context', function() {
          sinon.assert.calledWith(helper.cementHelper.createContext, sendInstanceStartEventJob);
          sinon.assert.called(sendInstanceStartEventContext.publish);
        });
      });
    });

    context('when insertContext context  emits reject event', function() {
      it('should emit reject event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        insertContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when insertContext emits error event', function() {
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
