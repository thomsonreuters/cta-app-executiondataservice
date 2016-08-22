'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mockrequire = require('mock-require');
const fs = require('fs');
const nodepath = require('path');

const Logger = require('cta-logger');
const Base = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/base/', 'index.js'));
const logicPath = nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/', 'index.js');
// let Logic = require(logicPath);

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

describe('BusinessLogics - Executions - constructor', function() {
  context('when everything ok', function() {
    let Logic;
    let logic;
    const mockHelpers = new Map();
    before(function() {
      // stubs all helpers available in the helpers directory
      const helpersDirectory = nodepath.join(appRootPath,
        '/lib/bricks/businesslogics/execution/helpers');
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
      Logic = require(logicPath); // eslint-disable-line global-require

      logic = new Logic(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    it('should extend Base Logic', function() {
      expect(Object.getPrototypeOf(Logic)).to.equal(Base);
    });

    it('should instantiate all available helpers', function() {
      mockHelpers.forEach((value, key) => {
        const noExtName = key.endsWith('.js') ? key.slice(0, -3) : key;
        sinon.assert.calledWith(value.MockConstructor, logic.cementHelper, logic.logger);
        expect(logic.helpers.has(noExtName)).to.equal(true);
        expect(logic.helpers.get(noExtName))
          .to.equal(value.MockConstructor.returnValues[0]);
      });
    });

    it('should return a Logic object', function() {
      expect(logic).to.be.an.instanceof(Logic);
    });
  });
});
