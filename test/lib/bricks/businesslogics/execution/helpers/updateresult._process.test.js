'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/helpers/', 'updateresult.js');
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

    const findResultsJob = {
      nature: {
        type: 'dbinterface',
        quality: 'getresultscount',
      },
      payload: {
        query: {
          executionId: DEFAULTINPUTJOB.payload.executionId,
        },
      },
    };
    const findResultsContext = new Context(DEFAULTCEMENTHELPER, findResultsJob);
    findResultsContext.publish = sinon.stub();

    const updateExecutionJob = {
      nature: {
        type: 'dbinterface',
        quality: 'updateone',
      },
      payload: {
        type: 'execution',
        id: DEFAULTINPUTJOB.payload.executionId,
        filter: {
          nbresults: { $lt: DATA.response.totalCount },
        },
        content: DATA.updatedExecutionFields,
      },
    };
    const updateExecutionContext = new Context(DEFAULTCEMENTHELPER, updateExecutionJob);
    updateExecutionContext.publish = sinon.stub();

    before(function() {
      sinon.stub(mockInputContext, 'emit');

      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
      // sinon.stub(helper, '_getExecutionUpdatedFields').returns(DATA.updatedExecutionFields);
      sinon.stub(helper.cementHelper, 'createContext')
        .onFirstCall()
        .returns(findExecutionContext)
        .onSecondCall()
        .returns(findResultsContext)
        .onThirdCall()
        .returns(updateExecutionContext);
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

      it('should send a findResults Context', function() {
        sinon.assert.called(findResultsContext.publish);
      });

      context('when findResultsContext emits done event', function() {
        context('when execution has less results than found', function() {
          before(function() {
            findResultsContext.emit('done', 'dblayer', DATA.response);
          });

          it('should send a updateExecution Context', function() {
            sinon.assert.called(updateExecutionContext.publish);
          });

          context('when updateExecutionContext emits done event', function() {
            const updatedExecution = _.cloneDeep(DATA.execution);
            before(function() {
              updateExecutionContext.emit('done', 'dblayer', updatedExecution);
            });

            it('should emit done event on inputContext with updated execution', function() {
              sinon.assert.calledWith(mockInputContext.emit,
                'done', helper.cementHelper.brickName, updatedExecution);
            });
          });

          context('when updateExecutionContext emits reject event', function() {
            const error = new Error('mockError');
            const brickName = 'dbinterface';
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
            const brickName = 'dbinterface';
            before(function() {
              updateExecutionContext.emit('error', brickName, error);
            });
            it('should emit error event on inputContext', function() {
              sinon.assert.calledWith(mockInputContext.emit,
                'error', brickName, error);
            });
          });
        });

        context('when execution has more results than found', function() {
          before(function () {
            const response = _.cloneDeep(DATA.response);
            response.totalCount = 1;
            findResultsContext.emit('done', 'dblayer', response);
          });

          it('should emit done event on inputContext with non-updated execution', function() {
            sinon.assert.calledWith(mockInputContext.emit,
              'done', helper.cementHelper.brickName, DATA.execution);
          });
        });
      });

      context('when findResultsContext emits reject event', function() {
        const error = new Error('mockError');
        const brickName = 'dbinterface';
        before(function() {
          findResultsContext.emit('reject', brickName, error);
        });
        it('should emit reject event on inputContext', function() {
          sinon.assert.calledWith(mockInputContext.emit,
            'reject', brickName, error);
        });
      });

      context('when findResultsContext emits error event', function() {
        const error = new Error('mockError');
        const brickName = 'dbinterface';
        before(function() {
          findResultsContext.emit('error', brickName, error);
        });
        it('should emit error event on inputContext', function() {
          sinon.assert.calledWith(mockInputContext.emit,
            'error', brickName, error);
        });
      });
    });

    context('when findExecutionContext emits reject event', function() {
      const error = new Error('mockError');
      const brickName = 'dbinterface';
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
      const brickName = 'dbinterface';
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
