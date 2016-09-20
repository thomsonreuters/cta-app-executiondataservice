'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'state.js'));
const data = require('./state.data.testdata.js');

describe('Data Model - State', function() {
  it('should return an State', function() {
    const object = new Model(data);
    expect(object).to.be.an.instanceof(Model);
    expect(object).to.have.property('id');
    expect(object).to.have.property('executionId', data.executionId);
    expect(object).to.have.property('timestamp', data.timestamp);
    expect(object).to.have.property('status', data.status);
    expect(object).to.have.property('ip', data.ip);
    expect(object).to.have.property('hostname', data.hostname);
    expect(object).to.have.property('index', data.index);
  });
});
