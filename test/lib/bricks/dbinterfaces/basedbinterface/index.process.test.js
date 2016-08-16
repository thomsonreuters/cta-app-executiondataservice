'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const mockrequire = require('mock-require');
const sinon = require('sinon');
require('sinon-as-promised');
const fs = require('fs');
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

describe('DatabaseInterfaces - BaseDBInterface - process', function() {
  const helpersDirectory = nodepath.join(appRootPath,
    '/lib/bricks/dbinterfaces/basedbinterface/helpers');
  const mockHelpers = new Map();
  const helperName = 'helperone';
  const JOB = {
    nature: {
      type: Interface.name.toLowerCase(),
      quality: helperName,
    },
    payload: {},
  };
  let dbinterface;
  before(function () {
    // create some mock helpers
    // helper mock #1
    mockHelpers.set(helperName, {
      MockConstructor: function (cementHelper) {
        return {
          ok: '1',
          cementHelper: cementHelper,
          _validate: function () {
          },
          _process: function () {
          },
        };
      },
      path: nodepath.join(helpersDirectory, helperName),
    });
    sinon.spy(mockHelpers.get(helperName), 'MockConstructor');
    mockrequire(mockHelpers.get(helperName).path,
      mockHelpers.get(helperName).MockConstructor);

    // stub fs readdirSync method
    // returns Array of mocked helpers directories
    sinon.stub(fs, 'readdirSync')
      .withArgs(helpersDirectory)
      .returns(Array.from(mockHelpers.keys()));

    dbinterface = new Interface(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
  });

  after(function () {
    mockrequire.stopAll();
    fs.readdirSync.restore();
  });

  context('when everything ok', function () {
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    let result;
    before(function () {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(dbinterface.helpers.get(helperName), '_process').withArgs(context).returns(true);
      result = dbinterface.process(context);
    });
    after(function () {
      Brick.prototype.validate.restore();
      dbinterface.helpers.get(helperName)._process.restore();
    });

    it('should return provider _validate() result', function () {
      return expect(result).to.be.equal(
        dbinterface.helpers.get(helperName)._process.returnValues[0]
      );
    });
  });
});
