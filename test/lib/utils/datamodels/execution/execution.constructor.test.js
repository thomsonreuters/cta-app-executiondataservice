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

    expect(object).to.have.property('startTimestamp', data.startTimestamp);
    expect(object).to.have.property('updateTimestamp', data.updateTimestamp);

    expect(object).to.have.property('result', data.result);
    expect(object).to.have.property('ok', data.ok || 0);
    expect(object).to.have.property('partial', data.partial || 0);
    expect(object).to.have.property('inconclusive', data.inconclusive || 0);
    expect(object).to.have.property('failed', data.failed || 0);
    expect(object).to.have.property('resultsCount', data.resultsCount || 0);

    expect(object).to.have.property('instances', data.instances);
    expect(object).to.have.property('commandsCount', data.commandsCount);
    expect(object).to.have.property('state', data.state);
    expect(object).to.have.property('cancelDetails', data.cancelDetails);
    expect(object).to.have.property('completed', data.completed || false);
  });
});
