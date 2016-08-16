'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const nodepath = require('path');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const Helper = require(nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/helpers/', 'save.js'));

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

describe('DatabaseInterfaces - MongoDB - Save - constructor', function() {
  let helper;
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
  });
  context('when everything ok', function() {
    const inputJOB = {
      nature: {
        type: 'dbinterface',
        quality: 'save',
      },
      payload: {
        type: 'execution',
        content: {},
      },
    };
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, inputJOB);
    let mockOutputContext;
    let outputJOB;
    before(function() {
      sinon.stub(mockInputContext, 'emit');

      outputJOB = {
        nature: {
          type: 'database',
          quality: 'query',
        },
        payload: {
          collection: inputJOB.payload.type,
          action: 'save',
          args: [
            inputJOB.payload.content,
          ],
        },
      };
      mockOutputContext = new Context(DEFAULTCEMENTHELPER, outputJOB);
      mockOutputContext.publish = sinon.stub();
      sinon.stub(helper.cementHelper, 'createContext')
        .withArgs(outputJOB)
        .returns(mockOutputContext);
      helper._process(mockInputContext);
    });
    after(function() {
      helper.cementHelper.createContext.restore();
    });
    it('should send a new Context', function() {
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
  });
});
