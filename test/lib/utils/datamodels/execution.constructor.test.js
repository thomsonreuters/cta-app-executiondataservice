'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'execution.js'));
const data = require('./execution.data.testdata.js');

describe('Data Model - Execution', function() {
  it('should return an Execution', function() {
    const object = new Model(data);
    expect(object).to.be.an.instanceof(Model);
    expect(object).to.have.property('id');
    expect(object).to.have.property('scenarioId', data.scenarioId);
    expect(object).to.have.property('userId', data.userId);
    expect(object).to.have.property('starttimestamp', data.starttimestamp);
    expect(object).to.have.property('updatetimestamp', data.updatetimestamp);
    expect(object).to.have.property('state', data.state);
    expect(object).to.have.property('cancel', data.cancel);
    expect(object).to.have.property('status', data.status);
    expect(object).to.have.property('ok', data.ok || 0);
    expect(object).to.have.property('partial', data.partial || 0);
    expect(object).to.have.property('inconclusive', data.inconclusive || 0);
    expect(object).to.have.property('failed', data.failed || 0);
    expect(object).to.have.property('nbstatuses', data.nbstatuses || 0);
    expect(object).to.have.property('done', data.done || false);
    expect(object).to.have.property('instances', data.instances);
  });
});
