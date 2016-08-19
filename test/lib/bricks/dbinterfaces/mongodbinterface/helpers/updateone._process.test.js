'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const requireSubvert = require('require-subvert')(__dirname);
const _ = require('lodash');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
const pathToHelper = nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/helpers/', 'updateone.js');
let Helper = require(pathToHelper);

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

describe('DatabaseInterfaces - MongoDB - UpdateOne - constructor', function() {
  let helper;
  const mockId = new ObjectID();
  const inputJOB = {
    nature: {
      type: 'dbinterface',
      quality: 'updateone',
    },
    payload: {
      type: 'execution',
      content: {
        id: mockId.toString(),
        foo: 'bar',
      },
    },
  };
  before(function() {
    const StubObjectIDModule = sinon.stub().withArgs(mockId.toString()).returns(mockId);
    requireSubvert.subvert('bson', {
      ObjectID: StubObjectIDModule,
    });
    Helper = requireSubvert.require(pathToHelper);
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
  });
  context('when everything ok', function() {
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, inputJOB);
    let mockOutputContext;
    let outputJOB;
    let mongoDbDocument;
    before(function() {
      sinon.stub(mockInputContext, 'emit');

      const mongoDbFilter = {
        _id: new ObjectID(inputJOB.payload.content.id),
      };
      mongoDbDocument = {
        $set: _.omit(inputJOB.payload.content, ['id']),
      };
      const mongoDbOptions = {
        returnOriginal: false,
      };
      outputJOB = {
        nature: {
          type: 'database',
          quality: 'query',
        },
        payload: {
          collection: inputJOB.payload.type,
          action: 'findOneAndUpdate',
          args: [
            mongoDbFilter,
            mongoDbDocument,
            mongoDbOptions,
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
      context('when document was found and updated', function() {
        it('should emit done event on inputContext', function() {
          const responseDocument = {
            _id: mockId,
          };
          const responseObject = _.omit(responseDocument, ['_id']);
          responseObject.id = responseDocument._id.toString();
          const response = {
            ok: 1,
            value: responseDocument,
          };

          mockOutputContext.emit('done', 'dblayer', response);
          sinon.assert.calledWith(mockInputContext.emit,
            'done', helper.cementHelper.brickName, responseObject);
        });
      });

      context('when document was not found', function() {
        it('should emit done event on inputContext', function() {
          const response = {
            ok: 1,
            value: null,
          };

          mockOutputContext.emit('done', 'dblayer', response);
          sinon.assert.calledWith(mockInputContext.emit,
            'done', helper.cementHelper.brickName, null);
        });
      });
    });

    context('when outputContext emits reject event', function() {
      it('should emit reject event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dblayer';
        mockOutputContext.emit('reject', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'reject', brickName, error);
      });
    });

    context('when outputContext emits error event', function() {
      it('should emit error event on inputContext', function() {
        const error = new Error('mockError');
        const brickName = 'dblayer';
        mockOutputContext.emit('error', brickName, error);
        sinon.assert.calledWith(mockInputContext.emit,
          'error', brickName, error);
      });
    });
  });
});
