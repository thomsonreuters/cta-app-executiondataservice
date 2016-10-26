'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
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
const DATA = require('./updatestate._process.testdata.js');

describe('BusinessLogics - Execution - UpdateState - _process', function() {
  let helper;
  context('when everything ok', function() {
    const DEFAULTINPUTJOB = DATA.job;
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, DEFAULTINPUTJOB);

    const findExecutionJob = {
      nature: {
        type: 'dbInterface',
        quality: 'findById',
      },
      payload: {
        type: 'execution',
        id: DEFAULTINPUTJOB.payload.executionId,
      },
    };
    const findExecutionContext = new Context(DEFAULTCEMENTHELPER, findExecutionJob);
    findExecutionContext.publish = sinon.stub();

    const findStatesJob = {
      nature: {
        type: 'dbInterface',
        quality: 'getStatesCount',
      },
      payload: {
        filter: {
          offset: 0,
          sort: {
            timestamp: -1,
          },
        },
        query: {
          executionId: DEFAULTINPUTJOB.payload.executionId,
        },
      },
    };
    const findStatesContext = new Context(DEFAULTCEMENTHELPER, findStatesJob);
    findStatesContext.publish = sinon.stub();

    const updateExecutionJob = {
      nature: {
        type: 'dbInterface',
        quality: 'updateOne',
      },
      payload: {
        type: 'execution',
        id: DEFAULTINPUTJOB.payload.executionId,
        content: DATA.updatedExecutionFields,
      },
    };
    const updateExecutionContext = new Context(DEFAULTCEMENTHELPER, updateExecutionJob);
    updateExecutionContext.publish = sinon.stub();

    const finalizeExecutionJob = {
      nature: {
        type: 'execution',
        quality: 'finalize',
      },
      payload: {
        executionId: DEFAULTINPUTJOB.payload.executionId,
      },
    };
    const finalizeExecutionContext = new Context(DEFAULTCEMENTHELPER, finalizeExecutionJob);
    finalizeExecutionContext.publish = sinon.stub();

    before(function() {
      sinon.stub(mockInputContext, 'emit');

      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
      // sinon.stub(helper, '_getExecutionUpdatedFields').returns(DATA.updatedExecutionFields);
      sinon.stub(helper.cementHelper, 'createContext')
        .onCall(0)
        .returns(findExecutionContext)
        .onCall(1)
        .returns(findStatesContext)
        .onCall(2)
        .returns(updateExecutionContext)
        .onCall(3)
        .returns(finalizeExecutionContext);
      helper._process(mockInputContext);
    });
    after(function() {
      requireSubvert.cleanUp();
      helper.cementHelper.createContext.restore();
      // helper._getExecutionUpdatedFields.restore();
    });

    it('should send a findExecution Context', function() {
      sinon.assert.calledWith(helper.cementHelper.createContext, findExecutionJob);
      sinon.assert.called(findExecutionContext.publish);
    });

    context('when findExecutionContext emits done event', function() {
      context('when execution has already been completed', function() {
        const execution = _.cloneDeep(DATA.execution);
        execution.completed = true;
        before(function() {
          findExecutionContext.emit('done', 'dblayer', execution);
        });

        it('should emit done event on inputContext with found execution', function() {
          sinon.assert.calledWith(mockInputContext.emit,
            'done', helper.cementHelper.brickName, execution);
        });
      });

      context('when execution has not been completed yet', function() {
        before(function() {
          findExecutionContext.emit('done', 'dblayer', DATA.execution);
        });

        it('should send a findStates Context', function() {
          sinon.assert.called(findStatesContext.publish);
        });

        context('when findStatesContext emits done event', function() {
          before(function() {
            findStatesContext.emit('done', 'dblayer', DATA.response);
          });

          it('should send a updateExecution Context', function() {
            sinon.assert.called(updateExecutionContext.publish);
          });

          context('when updateExecutionContext emits done event', function() {
            const updatedExecution = _.cloneDeep(DATA.execution);
            before(function() {
              updateExecutionContext.emit('done', 'dblayer', updatedExecution);
            });

            it('should send a finalizeExecutionContext Context', function() {
              sinon.assert.called(finalizeExecutionContext.publish);
            });

            context('when finalizeExecutionContext emits done event', function() {
              const finalizedExecution = _.cloneDeep(DATA.execution);
              before(function() {
                finalizeExecutionContext.emit('done', 'dblayer', finalizedExecution);
              });

              it('should emit done event on inputContext with updated execution', function() {
                sinon.assert.calledWith(mockInputContext.emit,
                  'done', helper.cementHelper.brickName, finalizedExecution);
              });
            });

            context('when finalizeExecutionContext emits reject event', function() {
              const error = new Error('mockError');
              const brickName = 'dbInterface';
              before(function() {
                finalizeExecutionContext.emit('reject', brickName, error);
              });
              it('should emit reject event on inputContext', function() {
                sinon.assert.calledWith(mockInputContext.emit,
                  'reject', brickName, error);
              });
            });

            context('when finalizeExecutionContext emits error event', function() {
              const error = new Error('mockError');
              const brickName = 'dbInterface';
              before(function() {
                finalizeExecutionContext.emit('error', brickName, error);
              });
              it('should emit error event on inputContext', function() {
                sinon.assert.calledWith(mockInputContext.emit,
                  'error', brickName, error);
              });
            });
          });

          context('when updateExecutionContext emits reject event', function() {
            const error = new Error('mockError');
            const brickName = 'dbInterface';
            before(function() {
              updateExecutionContext.emit('reject', brickName, error);
            });
            it('should emit reject event on inputContext', function() {
              sinon.assert.calledWith(mockInputContext.emit,
                'reject', brickName, error);
            });
          });

          context('when updateExecutionContext emits error event', function() {
            const error = new Error('mockError');
            const brickName = 'dbInterface';
            before(function() {
              updateExecutionContext.emit('error', brickName, error);
            });
            it('should emit error event on inputContext', function() {
              sinon.assert.calledWith(mockInputContext.emit,
                'error', brickName, error);
            });
          });
        });

        context('when findStatesContext emits reject event', function() {
          const error = new Error('mockError');
          const brickName = 'dbInterface';
          before(function() {
            findStatesContext.emit('reject', brickName, error);
          });
          it('should emit reject event on inputContext', function() {
            sinon.assert.calledWith(mockInputContext.emit,
              'reject', brickName, error);
          });
        });

        context('when findStatesContext emits error event', function() {
          const error = new Error('mockError');
          const brickName = 'dbInterface';
          before(function() {
            findStatesContext.emit('error', brickName, error);
          });
          it('should emit error event on inputContext', function() {
            sinon.assert.calledWith(mockInputContext.emit,
              'error', brickName, error);
          });
        });
      });
    });

    context('when findExecutionContext emits reject event', function() {
      const error = new Error('mockError');
      const brickName = 'dbInterface';
      before(function() {
        findExecutionContext.emit('reject', brickName, error);
      });
      it('should emit reject event on inputContext', function() {
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when findExecutionContext emits error event', function() {
      const error = new Error('mockError');
      const brickName = 'dbInterface';
      before(function() {
        findExecutionContext.emit('error', brickName, error);
      });
      it('should emit error event on inputContext', function() {
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
