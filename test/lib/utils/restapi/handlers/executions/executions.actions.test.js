'use strict';
const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const nodepath = require('path');

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

describe('Utils - RESTAPI - Handlers - Executions - actions', function() {
  let handler;
  before(function() {
    handler = new Handler(DEFAULTCEMENTHELPER);
  });
  context('when action is missing/incorrect in body', function() {
    const req = {};
    const res = {
      status: function() {
        return this;
      },
      send: function() {},
    };
    before(function() {
      req.method = 'POST';
      req.body = {
        action: {},
      };
      sinon.spy(res, 'status');
      sinon.spy(res, 'send');

      handler.actions(req, res, null);
    });
    after(function() {
    });
    it('should return 400', function() {
      const error = new Error('missing/incorrect action string in body');
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.send, error.message);
    });
  });

  context('when action is not supported', function() {
    const req = {};
    const res = {
      status: function() {
        return this;
      },
      send: function() {},
    };
    before(function() {
      req.method = 'POST';
      req.body = {
        action: 'not-a-supported-action',
      };
      sinon.spy(res, 'status');
      sinon.spy(res, 'send');

      handler.actions(req, res, null);
    });
    after(function() {
    });
    it('should return 400', function() {
      const error = new Error(`action '${req.body.action} is not supported.'`);
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.send, error.message);
    });
  });

  describe('action - cancel', function() {
    const req = {};
    const res = {
      status: function() {
        return this;
      },
      send: function() {},
    };
    before(function() {
      req.method = 'POST';
      req.body = {
        action: 'cancel',
      };
      sinon.spy(res, 'status');
      sinon.spy(res, 'send');
      sinon.stub(handler, 'cancel');
      handler.actions(req, res, null);
    });
    after(function() {
    });
    it('should call handler.cancel() method', function() {
      sinon.assert.calledWith(handler.cancel, req, res);
    });
  });
});

