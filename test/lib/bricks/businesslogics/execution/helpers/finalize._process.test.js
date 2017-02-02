'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/executions/helpers/', 'finalize.js');
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
const DATA = require('./finalize._process.testdata.js');

describe('BusinessLogics - Execution - Finalize - _process', function() {
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

    const getResultsIndexJob = {
      nature: {
        type: 'dbInterface',
        quality: 'getResultsIndex',
      },
      payload: {
        query: {
          executionId: DEFAULTINPUTJOB.payload.executionId,
        },
      },
    };
    const getResultsIndexContext = new Context(DEFAULTCEMENTHELPER, getResultsIndexJob);
    getResultsIndexContext.publish = sinon.stub();

    const getStatesIndexJob = {
      nature: {
        type: 'dbInterface',
        quality: 'getStatesIndex',
      },
      payload: {
        query: {
          executionId: DEFAULTINPUTJOB.payload.executionId,
        },
      },
    };
    const getStatesIndexContext = new Context(DEFAULTCEMENTHELPER, getStatesIndexJob);
    getStatesIndexContext.publish = sinon.stub();

    const updateExecutionJob = {
      nature: {
        type: 'dbInterface',
        quality: 'updateOne',
      },
      payload: {
        type: 'executions',
        id: DEFAULTINPUTJOB.payload.executionId,
        content: DATA.updatedExecutionFields,
      },
    };
    const updateExecutionContext = new Context(DEFAULTCEMENTHELPER, updateExecutionJob);
    updateExecutionContext.publish = sinon.stub();

    const completeExecutionJob = {
      nature: {
        type: 'executions',
        quality: 'complete',
      },
      payload: {
        id: DEFAULTINPUTJOB.payload.executionId,
        content: DATA.updatedExecutionFields,
      },
    };
    const completeExecutionContext = new Context(DEFAULTCEMENTHELPER, completeExecutionJob);
    completeExecutionContext.publish = sinon.stub();

    before(function() {
      sinon.stub(mockInputContext, 'emit');

      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
      // sinon.stub(helper, '_getExecutionUpdatedFields').returns(DATA.updatedExecutionFields);
      sinon.stub(helper.cementHelper, 'createContext')
        .onCall(0)
        .returns(findExecutionContext)
        .onCall(1)
        .returns(getResultsIndexContext)
        .onCall(2)
        .returns(getStatesIndexContext)
        .onCall(3)
        .returns(updateExecutionContext)
        .onCall(4)
        .returns(completeExecutionContext);
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
        before(function() {
          execution.completeTimestamp = Date.now();
          findExecutionContext.emit('done', 'dblayer', execution);
        });

        it('should emit done event on inputContext with non-updated execution', function() {
          sinon.assert.calledWith(mockInputContext.emit,
            'done', helper.cementHelper.brickName, execution);
        });
      });

      context('when execution has not been completed', function() {
        before(function() {
          findExecutionContext.emit('done', 'dblayer', DATA.execution);
        });

        it('should send a getResultsIndexContext Context', function() {
          sinon.assert.called(getResultsIndexContext.publish);
        });

        context('when getResultsIndexContext emit done event', function() {
          // context('when response is not an Array', function() {
          //   before(function() {
          //     getResultsIndexContext.emit('done', 'dblayer', {});
          //   });
          //
          //   it('should emit done event on inputContext with non-updated execution', function() {
          //     sinon.assert.calledWith(mockInputContext.emit,
          //       'done', helper.cementHelper.brickName, DATA.execution);
          //   });
          // });

          context('when there is continuous gap in resultsIndexes', function() {
            before(function() {
              getResultsIndexContext.emit('done', 'dblayer', DATA.gapResultsIndexes);
            });

            it('should emit done event on inputContext with non-updated execution', function() {
              sinon.assert.calledWith(mockInputContext.emit,
                'done', helper.cementHelper.brickName, DATA.execution);
            });
          });

          context('when there is no continuous gap in resultsIndexes', function() {
            before(function() {
              getResultsIndexContext.emit('done', 'dblayer', DATA.noGapResultsIndexes);
            });

            it('should send a updateExecution Context', function() {
              sinon.assert.called(getStatesIndexContext.publish);
            });

            context('when getStatesIndexContext emits done event', function() {
              context('when there is no missing results', function() {
                before(function() {
                  getStatesIndexContext.emit('done', 'dblayer', DATA.gapStatesIndexes);
                });

                it('should emit done event on inputContext with non-updated execution', function() {
                  sinon.assert.calledWith(mockInputContext.emit,
                    'done', helper.cementHelper.brickName, DATA.execution);
                });
              });

              context('when there is no missing results', function() {
                before(function() {
                  getStatesIndexContext.emit('done', 'dblayer', DATA.noGapStatesIndexes);
                });

                it('should send a updateExecution Context', function() {
                  sinon.assert.called(updateExecutionContext.publish);
                });

                context('when updateExecutionContext emits done event', function() {
                  const execution = _.cloneDeep(DATA.execution);
                  before(function() {
                    updateExecutionContext.emit('done', 'dblayer', execution);
                  });

                  it('should emit reject event on inputContext', function() {
                    sinon.assert.calledWith(mockInputContext.emit,
                      'done', helper.cementHelper.brickName, execution);
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
            });

            context('when getStatesIndexContext emits reject event', function() {
              const error = new Error('mockError');
              const brickName = 'dbInterface';
              before(function() {
                getStatesIndexContext.emit('reject', brickName, error);
              });
              it('should emit reject event on inputContext', function() {
                sinon.assert.calledWith(mockInputContext.emit,
                  'reject', brickName, error);
              });
            });

            context('when getStatesIndexContext emits error event', function() {
              const error = new Error('mockError');
              const brickName = 'dbInterface';
              before(function() {
                getStatesIndexContext.emit('error', brickName, error);
              });
              it('should emit error event on inputContext', function() {
                sinon.assert.calledWith(mockInputContext.emit,
                  'error', brickName, error);
              });
            });
          });
        });

        context('when getResultsIndexContext emits reject event', function() {
          const error = new Error('mockError');
          const brickName = 'dbInterface';
          before(function() {
            getResultsIndexContext.emit('reject', brickName, error);
          });
          it('should emit reject event on inputContext', function() {
            sinon.assert.calledWith(mockInputContext.emit,
              'reject', brickName, error);
          });
        });

        context('when getResultsIndexContext emits error event', function() {
          const error = new Error('mockError');
          const brickName = 'dbInterface';
          before(function() {
            getResultsIndexContext.emit('error', brickName, error);
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
