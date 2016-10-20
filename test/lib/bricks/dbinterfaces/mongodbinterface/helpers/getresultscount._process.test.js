'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const ObjectID = require('bson').ObjectID;
const nodepath = require('path');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/helpers/', 'getresultscount.js');
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

describe('DatabaseInterfaces - MongoDB - GetResultsCount - _process', function() {
  let helper;
  const mockExecutionId = new ObjectID();
  const inputJOB = {
    nature: {
      type: 'dbInterface',
      quality: 'getResultsCount',
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
    before(function() {
      sinon.stub(mockInputContext, 'emit');

      const mongoDbCollection = 'result';
      const mongoDbMatch = {
        executionId: mockExecutionId,
      };

      const mongoDbPipeline = [
        {
          $match: mongoDbMatch,
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: { testId: '$testId', hostname: '$hostname' },
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
        .returns(aggregateContext);
      helper._process(mockInputContext);
    });
    after(function() {
      helper.cementHelper.createContext.restore();
    });
    it('should send countContext', function() {
      sinon.assert.calledWith(helper.cementHelper.createContext, aggregateJob);
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
        const results = {
          ok: 0,
          failed: 0,
          partial: 0,
          inconclusive: 0,
        };
        aggregateResponse.forEach(function(result) {
          results[result.status] = result.count;
        });
        sinon.assert.calledWith(mockInputContext.emit,
          'done', helper.cementHelper.brickName, results);
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
});
