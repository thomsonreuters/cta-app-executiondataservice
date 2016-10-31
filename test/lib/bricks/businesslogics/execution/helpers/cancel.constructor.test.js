'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const Logger = require('cta-logger');
const Base = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/base/', 'basehelper.js'));
const Helper = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/execution/helpers/', 'cancel.js'));

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
  appProperties: {
    // executionApiUrl: 'http://localhost:3010/',
    // schedulerApiUrl: 'http://localhost:3011/',
    // jobManagerApiUrl: 'http://localhost:3012/',
  },
};
const DEFAULTAPIURLS = {
  executionApiUrl: 'http://localhost:3010/',
  schedulerApiUrl: 'http://localhost:3011/',
  jobManagerApiUrl: 'http://localhost:3012/',
};

describe('BusinessLogics - Execution - Cancel - constructor', function() {
  context('when everything ok', function() {
    let helper;
    before(function() {
      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, DEFAULTAPIURLS);
    });

    it('should extend BaseHelper', function() {
      expect(Object.getPrototypeOf(Helper)).to.equal(Base);
    });

    it('should return a handler instance', function() {
      expect(helper).to.be.an.instanceof(Helper);
    });
  });

  context('when missing/incorrect executionApiUrl', function() {
    const apiURLS = _.cloneDeep(DEFAULTAPIURLS);
    before(function() {
      delete apiURLS.executionApiUrl;
    });

    it('should throw an Error', function() {
      return expect(function() {
        return new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, apiURLS);
      }).to.throw(Error,
        'missing/incorrect \'executionApiUrl\' string in application global properties'
      );
    });
  });

  context('when missing/incorrect schedulerApiUrl', function() {
    const apiURLS = _.cloneDeep(DEFAULTAPIURLS);
    before(function() {
      delete apiURLS.schedulerApiUrl;
    });

    it('should throw an Error', function() {
      return expect(function() {
        return new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, apiURLS);
      }).to.throw(Error,
        'missing/incorrect \'schedulerApiUrl\' string in application global properties'
      );
    });
  });

  context('when missing/incorrect jobManagerApiUrl', function() {
    const apiURLS = _.cloneDeep(DEFAULTAPIURLS);
    before(function() {
      delete apiURLS.jobManagerApiUrl;
    });

    it('should throw an Error', function() {
      return expect(function() {
        return new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, apiURLS);
      }).to.throw(Error,
        'missing/incorrect \'jobManagerApiUrl\' string in application global properties'
      );
    });
  });
});
