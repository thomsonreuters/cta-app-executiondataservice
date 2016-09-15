'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const ObjectID = require('bson').ObjectID;
const nodepath = require('path');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/helpers/', 'getstatusescount.js');
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

describe('DatabaseInterfaces - MongoDB - GetStatusesCount - _process', function() {
  let helper;
  const mockExecutionId = new ObjectID();
  const inputJOB = {
    nature: {
      type: 'dbinterface',
      quality: 'getstatusescount',
    },
    payload: {
      query: {
        executionId: mockExecutionId.toString(),
      },
    },
  };
  const mockInputContext = new Context(DEFAULTCEMENTHELPER, inputJOB);
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
  });
  context('when everything ok', function() {
    let aggregateContext;
    let aggregateJob;
    let countContext;
    let countJob;
    before(function() {
      sinon.stub(mockInputContext, 'emit');

      const mongoDbCollection = 'status';
      const mongoDbMatch = {
        executionId: mockExecutionId,
      };

      countJob = {
        nature: {
          type: 'database',
          quality: 'query',
        },
        payload: {
          collection: mongoDbCollection,
          action: 'count',
          args: [
            mongoDbMatch,
          ],
        },
      };
      countContext = new Context(DEFAULTCEMENTHELPER, countJob);
      countContext.publish = sinon.stub();

      const mongoDbPipeline = [
        {
          $match: mongoDbMatch,
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: '$testId',
            doc: { $first: '$$ROOT' },
          },
        },
        {
          $group: {
            _id: '$doc.status',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            count: 1,
            status: '$_id',
          },
        },
      ];

      aggregateJob = {
        nature: {
          type: 'database',
          quality: 'query',
        },
        payload: {
          collection: mongoDbCollection,
          action: 'aggregate',
          args: [
            mongoDbPipeline,
          ],
        },
      };
      aggregateContext = new Context(DEFAULTCEMENTHELPER, aggregateJob);
      aggregateContext.publish = sinon.stub();

      sinon.stub(helper.cementHelper, 'createContext')
        // .withArgs(outputJOB)
        .onFirstCall()
        .returns(countContext)
        .onSecondCall()
        .returns(aggregateContext);
      helper._process(mockInputContext);
    });
    after(function() {
      helper.cementHelper.createContext.restore();
    });
    it('should send countContext', function() {
      sinon.assert.calledWith(helper.cementHelper.createContext, countJob);
      sinon.assert.called(countContext.publish);
    });

    context('when countContext emits done event', function() {
      const totalCount = 20;
      before(function() {
        countContext.emit('done', 'dblayer', totalCount);
      });

      it('should send a aggregateContext', function() {
        sinon.assert.called(aggregateContext.publish);
      });

      context('when aggregateContext emits done event', function() {
        const doc = {
          count: 10,
          status: 'failed',
        };
        const aggregateResponse = [doc];
        before(function() {
          aggregateContext.emit('done', 'dblayer', aggregateResponse);
        });
        it('shoud emit done event on inputContext', function() {
          const statuses = {
            ok: 0,
            failed: 0,
            partial: 0,
            inconclusive: 0,
          };
          aggregateResponse.forEach(function(status) {
            statuses[status.status] = status.count;
          });
          const response = {
            statusesCount: statuses,
            totalCount: totalCount,
          };
          sinon.assert.calledWith(mockInputContext.emit,
            'done', helper.cementHelper.brickName, response);
        });
      });

      context('when aggregateContext emits reject event', function() {
        it('should emit reject event on inputContext', function() {
          const error = new Error('mockError');
          const brickName = 'dblayer';
          aggregateContext.emit('reject', brickName, error);
          sinon.assert.calledWith(mockInputContext.emit,
            'reject', brickName, error);
        });
      });

      context('when aggregateContext emits error event', function() {
        it('should emit error event on inputContext', function() {
          const error = new Error('mockError');
          const brickName = 'dblayer';
          aggregateContext.emit('error', brickName, error);
          sinon.assert.calledWith(mockInputContext.emit,
            'error', brickName, error);
        });
      });
    });

    context('when countContext emits reject event', function() {
      it('should emit reject event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dblayer';
        countContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when countContext emits error event', function() {
      it('should emit error event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dblayer';
        countContext.emit('error', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
