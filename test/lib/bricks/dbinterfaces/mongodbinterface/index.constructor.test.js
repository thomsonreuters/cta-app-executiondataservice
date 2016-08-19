'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');

const Logger = require('cta-logger');
const Base = require(nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/basedbinterface/', 'index.js'));
const Interface = require(nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/', 'index.js'));

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

describe('DatabaseInterfaces - MongoDB - constructor', function() {
  context('when everything ok', function() {
    let logic;
    before(function() {
      logic = new Interface(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    it('should extend Base Interface', function() {
      expect(Object.getPrototypeOf(Interface)).to.equal(Base);
    });

    it('should return a Logic object', function() {
      expect(logic).to.be.an.instanceof(Interface);
    });
  });
});
