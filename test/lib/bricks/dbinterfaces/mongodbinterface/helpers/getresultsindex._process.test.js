'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const ObjectID = require('bson').ObjectID;
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/helpers/', 'getresultsindex.js');
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

describe('DatabaseInterfaces - MongoDB - GetResultsIndex - _process', function() {
  let helper;
  const mockExecutionId = new ObjectID();
  const inputJOB = {
    nature: {
      type: 'dbinterface',
      quality: 'getresultsindex',
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
          $project: {
            hostname: 1,
            index: 1,
          },
        },
        {
          $group: {
            _id: '$hostname',
            idxcount: { $sum: 1 },
            minidx: { $min: '$index' },
            maxidx: { $max: '$index' },
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
      const doc = [
        {
          _id: 'machine1',
          minidx: 1,
          maxidx: 3,
          idxcount: 3,
        },
        {
          _id: 'machine2',
          minidx: 1,
          maxidx: 4,
          idxcount: 4,
        },
      ];
      const reduce = doc.reduce(function(map, obj) {
        const response = map;
        response[obj._id] = _.pick(obj, ['idxcount', 'minidx', 'maxidx']);
        return response;
      }, {});
      before(function() {
        aggregateContext.emit('done', 'dblayer', doc);
      });
      it('shoud emit done event on inputContext', function() {
        sinon.assert.calledWith(mockInputContext.emit,
          'done', helper.cementHelper.brickName, reduce);
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
