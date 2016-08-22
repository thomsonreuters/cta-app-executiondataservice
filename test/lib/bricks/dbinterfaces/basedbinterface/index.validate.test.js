'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const nodepath = require('path');
const _ = require('lodash');

const Brick = require('cta-brick');
const Logger = require('cta-logger');
const Interface = require(nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/basedbinterface/', 'index.js'));

const DEFAULTCONFIG = require('./index.config.testdata.js');
const DEFAULTLOGGER = new Logger(null, null, DEFAULTCONFIG.name);
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: DEFAULTCONFIG.name,
  dependencies: {
    logger: DEFAULTLOGGER,
  },
};

describe('DatabaseInterfaces - BaseDBInterface - validate', function() {
  const helperName = 'helperone';
  const JOB = {
    nature: {
      type: 'dbinterface',
      quality: helperName,
    },
    payload: {},
  };
  let dbinterface;
  before(function () {
    // create some mock helpers
    const MockHelper = function (cementHelper) {
      return {
        ok: '1',
        cementHelper: cementHelper,
        _validate: function () {
        },
        _process: function () {
        },
      };
    };
    dbinterface = new Interface(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    dbinterface.helpers.set(helperName,
      new MockHelper(dbinterface.cementHelper, dbinterface.logger));
  });

  after(function () {
  });

  context('when everything ok', function() {
    let validatePromise;
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    before(function(done) {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(dbinterface.helpers.get(helperName), '_validate').resolves();
      dbinterface.validate(context).then(function(res) {
        validatePromise = res;
        done();
      }).catch(done);
    });
    after(function() {
      Brick.prototype.validate.restore();
      dbinterface.helpers.get(helperName)._validate.restore();
    });

    it('should call super validate()', function() {
      return expect(Brick.prototype.validate.calledOnce).to.be.true;
    });

    it('should call provider _validate()', function() {
      return expect(dbinterface.helpers.get(helperName)._validate.calledOnce).to.be.true;
    });

    it('should resolve', function() {
      return expect(validatePromise).to.have.property('ok', 1);
    });
  });

  context('when super validate rejects', function() {
    const mockError = new Error('mock error');
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    before(function() {
      sinon.stub(Brick.prototype, 'validate').rejects(mockError);
      sinon.stub(dbinterface.helpers.get(helperName), '_validate').resolves();
    });

    after(function() {
      Brick.prototype.validate.restore();
      dbinterface.helpers.get(helperName)._validate.restore();
    });

    it('should reject', function() {
      const validatePromise = dbinterface.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(mockError);
    });
  });

  context('when job type is not supported', function() {
    const job = _.cloneDeep(JOB);
    job.nature.type = 'not-a-dbinterface';
    const context = { data: job };
    before(function() {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(dbinterface.helpers.get(helperName), '_validate').resolves();
    });
    after(function() {
      Brick.prototype.validate.restore();
      dbinterface.helpers.get(helperName)._validate.restore();
    });

    it('should reject', function() {
      const validatePromise = dbinterface.validate(context);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, `type ${job.nature.type} not supported`);
    });
  });

  context('when job quality is not supported', function() {
    const job = _.cloneDeep(JOB);
    job.nature.quality = 'not-query';
    const context = { data: job };
    before(function() {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(dbinterface.helpers.get(helperName), '_validate').resolves();
    });
    after(function() {
      Brick.prototype.validate.restore();
      dbinterface.helpers.get(helperName)._validate.restore();
    });

    it('should reject', function() {
      const validatePromise = dbinterface.validate(context);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, `quality ${job.nature.quality} not supported`);
    });
  });

  context('when helper validate rejects', function() {
    const mockError = new Error('mock error');
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    before(function() {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(dbinterface.helpers.get(helperName), '_validate').rejects(mockError);
    });

    after(function() {
      Brick.prototype.validate.restore();
      dbinterface.helpers.get(helperName)._validate.restore();
    });

    it('should reject', function() {
      const validatePromise = dbinterface.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(mockError);
    });
  });
});
