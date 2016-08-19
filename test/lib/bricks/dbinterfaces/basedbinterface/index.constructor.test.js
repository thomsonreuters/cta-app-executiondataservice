'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const mockrequire = require('mock-require');
const sinon = require('sinon');
const fs = require('fs');
const nodepath = require('path');

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

describe('DatabaseInterfaces - BaseDBInterface - constructor', function() {
  const helpersDirectory = nodepath.join(appRootPath,
    '/lib/bricks/dbinterfaces/basedbinterface/helpers');

  context('when everything ok', function() {
    const mockHelpers = new Map();
    let dbinterface;
    before(function() {
      // create some mock helpers
      // helper mock #1
      mockHelpers.set('helperone', {
        MockConstructor: function() {
          return {
            helperone: 1,
          };
        },
        path: nodepath.join(helpersDirectory, 'helperone'),
      });
      sinon.spy(mockHelpers.get('helperone'), 'MockConstructor');
      mockrequire(mockHelpers.get('helperone').path,
        mockHelpers.get('helperone').MockConstructor);
      // helper mock #2
      mockHelpers.set('helpertwo.js', {
        MockConstructor: function() {
          return {
            helpertwo: 1,
          };
        },
        path: nodepath.join(helpersDirectory, 'helpertwo.js'),
      });
      sinon.spy(mockHelpers.get('helpertwo.js'), 'MockConstructor');
      mockrequire(mockHelpers.get('helpertwo.js').path,
        mockHelpers.get('helpertwo.js').MockConstructor);

      // stub fs readdirSync method
      // returns Array of mocked helpers directories
      sinon.stub(fs, 'readdirSync')
        .withArgs(helpersDirectory)
        .returns(Array.from(mockHelpers.keys()));

      dbinterface = new Interface(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    after(function() {
      mockrequire.stopAll();
      fs.readdirSync.restore();
    });

    it('should extend Brick', function() {
      expect(Object.getPrototypeOf(Interface)).to.equal(Brick);
    });

    it('should list content of the helpers directory', function() {
      return expect(fs.readdirSync.calledWith(helpersDirectory)).to.equal(true);
    });

    it('should instantiate a new instance per loaded helper', function() {
      // and adds it in dbinterface.helpers Map
      // the key being the provider name without .js extension
      mockHelpers.forEach((value, key) => {
        const noExtName = key.endsWith('.js') ? key.slice(0, -3) : key;
        expect(value.MockConstructor.calledWith(dbinterface.cementHelper)).to.equal(true);
        expect(dbinterface.helpers.has(noExtName)).to.equal(true);
        expect(dbinterface.helpers.get(noExtName))
          .to.equal(value.MockConstructor.returnValues[0]);
      });
    });

    it('should return an Interface object', function() {
      expect(dbinterface).to.be.an.instanceof(Interface);
    });
  });

  context('when listing helpers directory throws error', function() {
    const mockError = new Error('mock fs readdirSync error');
    before(function() {
      // stub fs readdirSync method
      // throws an error
      sinon.stub(fs, 'readdirSync')
        .withArgs(helpersDirectory)
        .throws(mockError);
    });

    after(function() {
      fs.readdirSync.restore();
    });

    it('should throw a fs error', function() {
      return expect(function() {
        return new Interface(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
      }).to.throw(mockError);
    });
  });

  context('when instantiating a helper throws error', function() {
    const mockHelpers = new Map();
    const mockError = new Error('mock helper error at instantiation');
    before(function() {
      // create some mock helpers
      // helper mock #1 throws error
      mockHelpers.set('helperone', {
        MockConstructor: function() {
          throw mockError;
        },
        path: nodepath.join(helpersDirectory, 'helperone'),
      });
      sinon.spy(mockHelpers.get('helperone'), 'MockConstructor');
      mockrequire(mockHelpers.get('helperone').path,
        mockHelpers.get('helperone').MockConstructor);

      // stub fs readdirSync method
      // returns Array of mocked helpers directories
      sinon.stub(fs, 'readdirSync')
        .withArgs(helpersDirectory)
        .returns(Array.from(mockHelpers.keys()));
    });

    after(function() {
      mockrequire.stopAll();
      fs.readdirSync.restore();
    });

    it('should throw a helper instantiation error', function() {
      return expect(function() {
        return new Interface(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
      }).to.throw(mockError);
    });
  });
});
