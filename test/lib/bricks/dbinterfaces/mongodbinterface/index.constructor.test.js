'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const nodepath = require('path');
const mockrequire = require('mock-require');
const fs = require('fs');

const Logger = require('cta-logger');
const Base = require(nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/basedbinterface/', 'index.js'));
const interfacePath = nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/', 'index.js');

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

describe('DatabaseInterfaces - MongoDB - Constructor', function() {
  context('when everything ok', function() {
    let Interface;
    let instance;
    const mockHelpers = new Map();
    const helpersCamelCasedNames = {
      'count.js': 'count',
      'deleteone.js': 'deleteOne',
      'find.js': 'find',
      'findbyid.js': 'findById',
      'getinstancesstates.js': 'getInstancesStates',
      'getresultscount.js': 'getResultsCount',
      'getresultsindex.js': 'getResultsIndex',
      'getstatescount.js': 'getStatesCount',
      'getstatesindex.js': 'getStatesIndex',
      'insertone.js': 'insertOne',
      'updateone.js': 'updateOne',
    };
    before(function() {
      // stubs all helpers available in the helpers directory
      const helpersDirectory = nodepath.join(appRootPath,
        '/lib/bricks/dbinterfaces/mongodbinterface/helpers');
      const helpersList = fs.readdirSync(helpersDirectory);
      helpersList.forEach(function(helperFileName) {
        mockHelpers.set(helperFileName, {
          MockConstructor: function() {
            return {
              ok: 1,
            };
          },
          path: nodepath.join(helpersDirectory, helperFileName),
        });
        sinon.spy(mockHelpers.get(helperFileName), 'MockConstructor');
        mockrequire(mockHelpers.get(helperFileName).path,
          mockHelpers.get(helperFileName).MockConstructor);
      });
      Interface = require(interfacePath); // eslint-disable-line global-require

      instance = new Interface(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    it('should extend Base Interface', function() {
      expect(Object.getPrototypeOf(Interface)).to.equal(Base);
    });

    it('should instantiate all available helpers', function() {
      mockHelpers.forEach((value, key) => {
        const helperName = helpersCamelCasedNames[key];
        sinon.assert.calledWith(value.MockConstructor, instance.cementHelper, instance.logger);
        expect(instance.helpers.has(helperName)).to.equal(true);
        expect(instance.helpers.get(helperName))
          .to.equal(value.MockConstructor.returnValues[0]);
      });
    });

    it('should return a Interface object', function() {
      expect(instance).to.be.an.instanceof(Interface);
    });
  });
});
