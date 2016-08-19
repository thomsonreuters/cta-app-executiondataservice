'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');

const Logger = require('cta-logger');
const Base = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/base/', 'index.js'));
const Logic = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/', 'index.js'));

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
    let logic;
    before(function() {
      logic = new Logic(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    it('should extend Base Logic', function() {
      expect(Object.getPrototypeOf(Logic)).to.equal(Base);
    });

    it('should return a Logic object', function() {
      expect(logic).to.be.an.instanceof(Logic);
    });
  });
});
