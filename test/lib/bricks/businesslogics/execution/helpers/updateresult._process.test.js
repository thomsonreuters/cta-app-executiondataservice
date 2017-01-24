'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/executions/helpers/', 'updateresult.js');
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
const DATA = require('./updateresult._process.testdata.js');

describe('BusinessLogics - Execution - UpdateResult - _process', function() {
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
        type: 'executions',
        id: DEFAULTINPUTJOB.payload.executionId,
      },
    };
    const findExecutionContext = new Context(DEFAULTCEMENTHELPER, findExecutionJob);
    findExecutionContext.publish = sinon.stub();

    const countResultsJob = {
      nature: {
        type: 'dbInterface',
        quality: 'count',
      },
      payload: {
        type: 'results',
        query: {
          executionId: DEFAULTINPUTJOB.payload.executionId,
        },
      },
    };
    const countResultsContext = new Context(DEFAULTCEMENTHELPER, countResultsJob);
    countResultsContext.publish = sinon.stub();

    const aggregateResultsJob = {
      nature: {
        type: 'dbInterface',
        quality: 'getResultsCount',
      },
      payload: {
        query: {
          executionId: DEFAULTINPUTJOB.payload.executionId,
        },
      },
    };
    const aggregateResultsContext = new Context(DEFAULTCEMENTHELPER, aggregateResultsJob);
    aggregateResultsContext.publish = sinon.stub();

    const updateExecutionJob = {
      nature: {
        type: 'dbInterface',
        quality: 'updateOne',
      },
      payload: {
        type: 'executions',
        id: DEFAULTINPUTJOB.payload.executionId,
        filter: {
          resultsCount: { $lt: DATA.count },
        },
        content: DATA.updatedExecutionFields,
      },
    };
    const updateExecutionContext = new Context(DEFAULTCEMENTHELPER, updateExecutionJob);
    updateExecutionContext.publish = sinon.stub();

    const finalizeExecutionJob = {
      nature: {
        type: 'executions',
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
        .returns(countResultsContext)
        .onCall(2)
        .returns(aggregateResultsContext)
        .onCall(3)
        .returns(updateExecutionContext)
        .onCall(4)
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
      before(function() {
        findExecutionContext.emit('done', 'dblayer', DATA.execution);
      });

      it('should send a countResultsContext Context', function() {
        sinon.assert.called(countResultsContext.publish);
      });

      context('when countResultsContext emit done event', function() {
        context('when execution has less results than found', function() {
          before(function() {
            countResultsContext.emit('done', 'dblayer', DATA.count);
          });

          it('should send a aggregateResultsContext Context', function() {
            sinon.assert.called(aggregateResultsContext.publish);
          });

          context('when aggregateResultsContext emits done event', function() {
            before(function() {
              aggregateResultsContext.emit('done', 'dblayer', DATA.aggregation);
            });

            it('should send a updateExecution Context', function() {
              sinon.assert.called(updateExecutionContext.publish);
            });

            context('when updateExecutionContext emits done event', function() {
              context('when updatedExecution is null (no update)', function() {
                before(function() {
                  updateExecutionContext.emit('done', 'dblayer', null);
                });

                it('should emit done event on inputContext with null', function() {
                  sinon.assert.calledWith(mockInputContext.emit,
                    'done', helper.cementHelper.brickName, null);
                });
              });

              context('when updatedExecution is non null', function() {
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

          context('when aggregateResultsContext emits reject event', function() {
            const error = new Error('mockError');
            const brickName = 'dbInterface';
            before(function() {
              aggregateResultsContext.emit('reject', brickName, error);
            });
            it('should emit reject event on inputContext', function() {
              sinon.assert.calledWith(mockInputContext.emit,
                'reject', brickName, error);
            });
          });

          context('when aggregateResultsContext emits error event', function() {
            const error = new Error('mockError');
            const brickName = 'dbInterface';
            before(function() {
              aggregateResultsContext.emit('error', brickName, error);
            });
            it('should emit error event on inputContext', function() {
              sinon.assert.calledWith(mockInputContext.emit,
                'error', brickName, error);
            });
          });
        });

        context('when execution has more results than found', function() {
          before(function() {
            countResultsContext.emit('done', 'dblayer', 1);
          });

          it('should emit done event on inputContext with non-updated execution', function() {
            sinon.assert.calledWith(mockInputContext.emit,
              'done', helper.cementHelper.brickName, DATA.execution);
          });
        });
      });

      context('when countResultsContext emits reject event', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        before(function() {
          countResultsContext.emit('reject', brickName, error);
        });
        it('should emit reject event on inputContext', function() {
          sinon.assert.calledWith(mockInputContext.emit,
            'reject', brickName, error);
        });
      });

      context('when countResultsContext emits error event', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        before(function() {
          countResultsContext.emit('error', brickName, error);
        });
        it('should emit error event on inputContext', function() {
          sinon.assert.calledWith(mockInputContext.emit,
            'error', brickName, error);
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
