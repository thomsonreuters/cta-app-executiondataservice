'use strict';
const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const nodepath = require('path');
const _ = require('lodash');

const EventEmitter = require('events');
const Logger = require('cta-logger');
const Handler = require(nodepath.join(appRootPath,
  '/lib/utils/restapi/handlers/', 'results.js'));
const Result = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels/', 'result.js'));

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

describe('Utils - RESTAPI - Handlers - Results - find', function() {
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
    let sinonCustomMatcher;
    let mockContext;
    before(function() {
      req.query = {
        limit: 10,
        offset: 0,
        sort: '-requestTimestamp,resultsCount',
        status: 'finished',
      };
      const filter = {
        limit: parseInt(req.query.limit, 10),
        offset: parseInt(req.query.offset, 0),
        sort: {
          requestTimestamp: -1,
          resultsCount: 1,
        },
      };
      const query = Result.convertQueryStrings(_.omit(req.query, Object.keys(filter)));
      sinonCustomMatcher = sinon.match(function(data) {
        return _.isEqual(data, {
          nature: {
            type: 'result',
            quality: 'find',
          },
          payload: {
            filter: filter,
            query: query,
          },
        });
      }, 'sinon custom matcher failed');

      mockContext = new EventEmitter();
      mockContext.publish = sinon.stub();
      sinon.stub(handler.cementHelper, 'createContext')
        .withArgs(sinonCustomMatcher)
        .returns(mockContext);
    });
    after(function() {
      handler.cementHelper.createContext.restore();
    });
    it('should send a new Context', function() {
      handler.find(req, res, null);
      sinon.assert.calledWith(handler.cementHelper.createContext, sinonCustomMatcher);
      sinon.assert.called(mockContext.publish);
    });

    context('when Context emits done event', function() {
      context('when document is found', function() {
        before(function() {
          sinon.spy(res, 'send');
          handler.find(req, res, null);
        });
        after(function() {
          res.send.restore();
        });
        it('should send the found Object (res.send())', function() {
          const mockBrickname = 'businesslogic';
          const response = {};
          mockContext.emit('done', mockBrickname, response);
          sinon.assert.calledWith(res.send, response);
        });
      });
    });

    context('when Context emits error event', function() {
      before(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
        handler.find(req, res, null);
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
        handler.find(req, res, null);
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
});
