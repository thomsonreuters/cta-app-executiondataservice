'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const nodeUrl = require('url');
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
const DEFAULTAPIURLS = {
  executionApiUrl: 'http://localhost:3010/',
  schedulerApiUrl: 'http://localhost:3011/',
  jobManagerApiUrl: 'http://localhost:3012/',
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

    const getInstancesStatesJob = {
      nature: {
        type: 'dbInterface',
        quality: 'getInstancesStates',
      },
      payload: {
        query: {
          executionId: DEFAULTINPUTJOB.payload.executionId,
        },
      },
    };
    const getInstancesStatesContext = new Context(DEFAULTCEMENTHELPER, getInstancesStatesJob);
    getInstancesStatesContext.publish = sinon.stub();

    const deleteScheduleJob = {
      nature: {
        type: 'request',
        quality: 'delete',
      },
      payload: {
        url: nodeUrl.resolve(DEFAULTAPIURLS.schedulerApiUrl,
          `/schedules/${DATA.updatedExecution.pendingTimeoutScheduleId}`),
      },
    };
    const deleteScheduleContext = new Context(DEFAULTCEMENTHELPER, deleteScheduleJob);
    deleteScheduleContext.publish = sinon.stub();

    before(function() {
      sinon.stub(mockInputContext, 'emit');

      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, DEFAULTAPIURLS);
      // sinon.stub(helper, '_getExecutionUpdatedFields').returns(DATA.updatedExecutionFields);
      sinon.stub(helper.cementHelper, 'createContext')
        .onCall(0)
        .returns(findExecutionContext)
        .onCall(1)
        .returns(findStatesContext)
        .onCall(2)
        .returns(updateExecutionContext)
        .onCall(3)
        .returns(finalizeExecutionContext)
        .onCall(4)
        .returns(getInstancesStatesContext)
        .onCall(5)
        .returns(deleteScheduleContext);
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
        execution.completeTimestamp = Date.now();
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
            const updatedExecution = _.cloneDeep(DATA.updatedExecution);
            before(function() {
              updateExecutionContext.emit('done', 'dblayer', updatedExecution);
            });

            it('should send a finalizeExecutionContext Context', function() {
              sinon.assert.called(finalizeExecutionContext.publish);
            });

            context('when finalizeExecutionContext emits done event', function() {
              const finalizedExecution = _.cloneDeep(DATA.updatedExecution);
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

            it('should send a getInstancesStatesContext Context', function() {
              sinon.assert.called(getInstancesStatesContext.publish);
            });

            context('when getInstancesStatesContext emits done event', function() {
              context('when execution was not pending', function() {
                const instancesStates = _.cloneDeep(DATA.instancesStates);
                instancesStates.pop();
                before(function() {
                  DATA.execution.state = 'running';
                  getInstancesStatesContext.emit('done', 'dblayer', instancesStates);
                });
                after(function() {
                  DATA.execution.state = 'pending';
                });

                it('should not send deleteScheduleContext context', function() {
                  sinon.assert.notCalled(deleteScheduleContext.publish);
                });
              });

              context('when not all instances have answered a State', function() {
                const instancesStates = _.cloneDeep(DATA.instancesStates);
                instancesStates.pop();
                before(function() {
                  getInstancesStatesContext.emit('done', 'dblayer', instancesStates);
                });

                it('should not send deleteScheduleContext context', function() {
                  sinon.assert.notCalled(deleteScheduleContext.publish);
                });
              });

              context('when all instances have answered a State', function() {
                context('when at least one instance is still pending', function() {
                  const instancesStates = _.cloneDeep(DATA.instancesStates);
                  instancesStates[0].state = 'pending';
                  before(function() {
                    getInstancesStatesContext.emit('done', 'dblayer', instancesStates);
                  });

                  it('should not send deleteScheduleContext context', function() {
                    sinon.assert.notCalled(deleteScheduleContext.publish);
                  });
                });

                context('when no instances are still pending', function() {
                  const instancesStates = _.cloneDeep(DATA.instancesStates);
                  before(function() {
                    getInstancesStatesContext.emit('done', 'dblayer', instancesStates);
                  });

                  it('should send deleteScheduleContext context', function() {
                    sinon.assert.called(deleteScheduleContext.publish);
                  });
                });
              });
            });

            context('when getInstancesStatesContext emits reject event', function() {
              const error = new Error('mockError');
              const brickName = 'dbInterface';
              before(function() {
                getInstancesStatesContext.emit('reject', brickName, error);
              });
              it('should emit reject event on inputContext', function() {
                sinon.assert.calledWith(mockInputContext.emit,
                  'reject', brickName, error);
              });
            });

            context('when getInstancesStatesContext emits error event', function() {
              const error = new Error('mockError');
              const brickName = 'dbInterface';
              before(function() {
                getInstancesStatesContext.emit('error', brickName, error);
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
