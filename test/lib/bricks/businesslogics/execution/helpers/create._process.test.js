'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');

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
    let mockOutputContext;
    let outputJOB;
    before(function() {
      sinon.stub(mockInputContext, 'emit');

      const mockExecution = new Execution({
        id: 'foo',
        scenarioId: 'bar',
        userId: 'quz',
        starttimestamp: 1231923018230123,
        instances: [],
      });
      const StubExecutionConstructor = sinon.stub().returns(mockExecution);
      requireSubvert.subvert(pathToExecution, StubExecutionConstructor);
      Helper = requireSubvert.require(pathToHelper);

      outputJOB = {
        nature: {
          type: 'dbinterface',
          quality: 'insertone',
        },
        payload: {
          type: 'execution',
          content: mockExecution,
        },
      };
      mockOutputContext = new Context(DEFAULTCEMENTHELPER, outputJOB);
      mockOutputContext.publish = sinon.stub();

      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
      sinon.stub(helper.cementHelper, 'createContext')
        .withArgs(outputJOB)
        .returns(mockOutputContext);
      helper._process(mockInputContext);
    });
    after(function() {
      requireSubvert.cleanUp();
      helper.cementHelper.createContext.restore();
    });

    it('should send a new Context insertone', function() {
      sinon.assert.calledWith(helper.cementHelper.createContext, outputJOB);
      sinon.assert.called(mockOutputContext.publish);
    });

    context('when outputContext emits done event', function() {
      it('should emit done event on inputContext', function() {
        const response = {};
        mockOutputContext.emit('done', 'dblayer', response);
        sinon.assert.calledWith(mockInputContext.emit,
          'done', helper.cementHelper.brickName, response);
      });
    });

    context('when outputContext emits reject event', function() {
      it('should emit reject event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbinterface';
        mockOutputContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when outputContext emits error event', function() {
      it('should emit error event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbinterface';
        mockOutputContext.emit('error', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
