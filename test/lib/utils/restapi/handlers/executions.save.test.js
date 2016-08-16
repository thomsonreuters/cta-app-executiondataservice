'use strict';
const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const _ = require('lodash');
const nodepath = require('path');

const EventEmitter = require('events');
const Logger = require('cta-logger');
const Handler = require(nodepath.join(appRootPath,
  '/lib/utils/restapi/handlers/', 'executions.js'));

const DEFAULTLOGGER = new Logger();
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: 'restapi',
  logger: DEFAULTLOGGER,
  dependencies: {
  },
  createContext: function() {},
};
const EXECUTION = require('./executions.save.sample.testdata.js');

describe('Utils - RESTAPI - Handlers - Executions - save', function() {
  let handler;
  before(function() {
    handler = new Handler(DEFAULTCEMENTHELPER);
  });
  context('when everything ok', function() {
    const req = {};
    const res = {};
    let data;
    let mockContext;
    before(function() {
      req.body = _.cloneDeep(EXECUTION);
      res.send = sinon.stub();
      data = {
        nature: {
          type: 'execution',
          quality: 'save',
        },
        payload: req.body,
      };
      mockContext = new EventEmitter();
      mockContext.publish = sinon.stub();
      sinon.stub(handler.cementHelper, 'createContext')
        .withArgs(data)
        .returns(mockContext);
      handler.save(req, res, null);
    });
    after(function() {
      handler.cementHelper.createContext.restore();
    });
    it('should send a new Context', function() {
      sinon.assert.calledWith(handler.cementHelper.createContext, data);
      sinon.assert.called(mockContext.publish);
    });

    context('when Context emits done event', function() {
      it('should send the response (res.send())', function() {
        const mockBrickname = 'businesslogic';
        const response = { ok: 1 };
        mockContext.emit('done', mockBrickname, response);
        sinon.assert.calledWith(res.send, response);
      });
    });
  });
});

