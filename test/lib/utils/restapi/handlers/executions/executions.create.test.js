'use strict';
const appRootPath = require('cta-common').root('cta-app-executiondataservice');
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
const EXECUTION = require('./executions.create.sample.testdata.js');

describe('Utils - RESTAPI - Handlers - Executions - create', function() {
  let handler;
  before(function() {
    handler = new Handler(DEFAULTCEMENTHELPER);
  });
  context('when everything ok', function() {
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
      req.method = 'POST';
      req.params = {};
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
    it('should publish a new Context', function() {
      handler.create(req, res, null);
      sinon.assert.calledWith(handler.cementHelper.createContext, data);
      sinon.assert.called(mockContext.publish);
    });

    context('when Context emits done event', function() {
      before(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
        handler.create(req, res, null);
      });
      after(function() {
        res.status.restore();
        res.send.restore();
      });
      it('should send the response (res.send())', function() {
        const mockBrickname = 'businesslogic';
        const response = { ok: 1 };
        mockContext.emit('done', mockBrickname, response);
        sinon.assert.calledWith(res.status, 201);
        sinon.assert.calledWith(res.send, response);
      });
    });

    context('when Context emits error event', function() {
      before(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
        handler.create(req, res, null);
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
        handler.create(req, res, null);
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

  context('when method is PUT and id is not provided', function() {
    context('when id is provided', function() {
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
        req.method = 'PUT';
        req.params = {
          id: 'foobar',
        };
        req.body = _.cloneDeep(EXECUTION);
        data = {
          nature: {
            type: 'execution',
            quality: 'create',
          },
          payload: req.body,
        };
        data.payload.id = req.params.id;
        mockContext = new EventEmitter();
        mockContext.publish = sinon.stub();
        sinon.stub(handler.cementHelper, 'createContext')
          .withArgs(data)
          .returns(mockContext);
      });
      after(function() {
        handler.cementHelper.createContext.restore();
      });
      it('should publish a new Context', function() {
        handler.create(req, res, null);
        sinon.assert.calledWith(handler.cementHelper.createContext, data);
        sinon.assert.called(mockContext.publish);
      });
    });

    context('when id is not provided', function() {
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
        req.method = 'PUT';
        req.params = {};
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
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
      });
      after(function() {
        res.status.restore();
        res.send.restore();
        handler.cementHelper.createContext.restore();
      });
      it('should send 400', function() {
        handler.create(req, res, null);
        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.send, 'Missing \'id\' property');
      });
    });
  });
});

