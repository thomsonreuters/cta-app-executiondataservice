'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const sinon = require('sinon');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/helpers/', 'update.js');
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

describe('BusinessLogics - Execution - Update - _process', function() {
  let helper;
  context('when everything ok', function() {
    const mockId = new ObjectID();
    const DEFAULTINPUTJOB = {
      nature: {
        type: 'execution',
        quality: 'update',
      },
      payload: {
        id: mockId.toString(),
        content: {},
      },
    };
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, DEFAULTINPUTJOB);
    let mockOutputContext;
    let outputJOB;
    before(function() {
      sinon.stub(mockInputContext, 'emit');
      outputJOB = {
        nature: {
          type: 'dbInterface',
          quality: 'updateOne',
        },
        payload: {
          type: 'execution',
          id: DEFAULTINPUTJOB.payload.id,
          content: _.omit(DEFAULTINPUTJOB.payload, ['id']),
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

    it('should send a new Context insertOne', function() {
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
        const brickName = 'dbInterface';
        mockOutputContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when outputContext emits error event', function() {
      it('should emit error event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dbInterface';
        mockOutputContext.emit('error', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
