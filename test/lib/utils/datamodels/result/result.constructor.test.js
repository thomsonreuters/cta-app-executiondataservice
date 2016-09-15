'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'result.js'));
const data = require('./result.data.testdata.js');

describe('Data Model - Result', function() {
  it('should return an Result', function() {
    const object = new Model(data);
    expect(object).to.be.an.instanceof(Model);
    expect(object).to.have.property('id');
    expect(object).to.have.property('executionId', data.executionId);
    // expect(object).to.have.property('scenarioId', data.scenarioId);
    // expect(object).to.have.property('configurationId', data.configurationId);
    // expect(object).to.have.property('testsuiteId', data.testsuiteId);
    expect(object).to.have.property('testId', data.testId);
    expect(object).to.have.property('timestamp', data.timestamp);
    // expect(object).to.have.property('parentId', data.parentId);
    expect(object).to.have.property('status', data.status);
    expect(object).to.have.property('ip', data.ip);
    expect(object).to.have.property('hostname', data.hostname);
    expect(object).to.have.property('type', data.type);
    expect(object).to.have.property('name', data.name);
    expect(object).to.have.property('description', data.description);
    expect(object).to.have.property('screenshot', data.screenshot);
    expect(object).to.have.property('custom', data.custom);
  });
});
