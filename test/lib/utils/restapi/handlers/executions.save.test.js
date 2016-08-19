'use strict';
const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const _ = require('lodash');
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;

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
  context('when id is not provided (create)', function() {
    const req = {};
    const res = {
      status: function() {
        return this;
      },
      send: function() {},
    };
    let data;
    let mockContext;
    before(function() {
      req.body = _.cloneDeep(EXECUTION);
      data = {
        nature: {
          type: 'execution',
          quality: 'create',
        },
        payload: req.body,
      };
      mockContext = new EventEmitter();
      mockContext.publish = sinon.stub();
      sinon.stub(handler.cementHelper, 'createContext')
        .withArgs(data)
        .returns(mockContext);
    });
    after(function() {
      handler.cementHelper.createContext.restore();
    });
    it('should send a new Context', function() {
      handler.save(req, res, null);
      sinon.assert.calledWith(handler.cementHelper.createContext, data);
      sinon.assert.called(mockContext.publish);
    });

    context('when Context emits done event', function() {
      before(function() {
        sinon.spy(res, 'send');
        handler.save(req, res, null);
      });
      after(function() {
        res.send.restore();
      });
      it('should send the response (res.send())', function() {
        const mockBrickname = 'businesslogic';
        const response = { ok: 1 };
        mockContext.emit('done', mockBrickname, response);
        sinon.assert.calledWith(res.send, response);
      });
    });

    context('when Context emits error event', function() {
      before(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
        handler.save(req, res, null);
      });
      after(function() {
        res.status.restore();
        res.send.restore();
      });
      it('should send the error message', function () {
        const error = new Error('mockError');
        const mockBrickname = 'businesslogic';
        mockContext.emit('error', mockBrickname, error);
        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.send, error.message);
      });
    });

    context('when Context emits reject event', function() {
      before(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
        handler.save(req, res, null);
      });
      after(function() {
        res.status.restore();
        res.send.restore();
      });
      it('should send the error message', function () {
        const error = new Error('mockError');
        const mockBrickname = 'businesslogic';
        mockContext.emit('reject', mockBrickname, error);
        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.send, error.message);
      });
    });
  });

  context('when id is provided (update)', function() {
    const req = {};
    const res = {
      status: function () {
        return this;
      },
      send: function () {
      },
    };
    let data;
    let mockContext;
    before(function () {
      req.body = _.cloneDeep(EXECUTION);
      req.body.id = (new ObjectID()).toString();
      data = {
        nature: {
          type: 'execution',
          quality: 'update',
        },
        payload: req.body,
      };
      mockContext = new EventEmitter();
      mockContext.publish = sinon.stub();
      sinon.stub(handler.cementHelper, 'createContext')
        .withArgs(data)
        .returns(mockContext);
    });
    after(function () {
      handler.cementHelper.createContext.restore();
    });
    it('should send a new Context', function () {
      handler.save(req, res, null);
      sinon.assert.calledWith(handler.cementHelper.createContext, data);
      sinon.assert.called(mockContext.publish);
    });


    context('when document is found', function() {
      before(function() {
        sinon.spy(res, 'send');
        handler.save(req, res, null);
      });
      after(function() {
        res.send.restore();
      });
      it('should send the found Object (res.send())', function() {
        const mockBrickname = 'businesslogic';
        const response = { id: req.body.id };
        mockContext.emit('done', mockBrickname, response);
        sinon.assert.calledWith(res.send, response);
      });
    });

    context('when document is not found', function() {
      before(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
        handler.save(req, res, null);
      });
      after(function() {
        res.status.restore();
        res.send.restore();
      });
      it('should send 404', function() {
        const mockBrickname = 'businesslogic';
        const response = null;
        mockContext.emit('done', mockBrickname, response);
        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.send, 'Execution not found.');
      });
    });
  });
});

