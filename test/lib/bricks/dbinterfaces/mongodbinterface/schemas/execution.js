'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');
const ObjectID = require('bson').ObjectID;

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'execution.js'));
const Schema = require(nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/schemas', 'execution.js'));


describe('DatabaseInterfaces - MongoDB - Schema - Execution', function() {
  describe('constructor', function() {
    const data = {
      id: (new ObjectID()).toString(),
      scenarioId: (new ObjectID()).toString(),
      userId: (new ObjectID()).toString(),
      requestTimestamp: 1000,
      updateTimestamp: 1000,
      state: 'pending', // pending,running,acked, cancelled, finished
    };
    const execution = new Model(data);
    it('should return an ExecutionSchema', function() {
      const object = new Schema(execution);
      expect(object.id).to.not.exist; // eslint-disable-line no-unused-expressions
      expect(object._id).to.be.an.instanceof(ObjectID);
      expect(object._id.toString()).to.equal(execution.id);
      expect(object.scenarioId).to.be.an.instanceof(ObjectID);
      expect(object.scenarioId.toString()).to.equal(execution.scenarioId);
      expect(object.userId).to.be.an.instanceof(ObjectID);
      expect(object.userId.toString()).to.equal(execution.userId);
      expect(object.requestTimestamp).to.equal(execution.requestTimestamp);
      expect(object.updateTimestamp).to.equal(execution.updateTimestamp);
      expect(object.state).to.equal(execution.state);
    });
  });

  describe('toCTAData', function() {
    const mongodbDoc = {
      _id: (new ObjectID()),
      scenarioId: (new ObjectID()),
      userId: (new ObjectID()),
      requestTimestamp: 1000,
      updateTimestamp: 1000,
      state: 'pending', // pending,running,acked, cancelled, finished
    };
    it('should return an Execution', function() {
      const object = Schema.toCTAData(mongodbDoc);
      expect(object).to.be.an.instanceof(Model);
      expect(object._id).to.not.exist; // eslint-disable-line no-unused-expressions
      expect(object.id).to.equal(mongodbDoc._id.toString());
      expect(object.scenarioId).to.equal(mongodbDoc.scenarioId.toString());
      expect(object.userId).to.equal(mongodbDoc.userId.toString());
      expect(object.requestTimestamp).to.equal(mongodbDoc.requestTimestamp);
      expect(object.updateTimestamp).to.equal(mongodbDoc.updateTimestamp);
      expect(object.state).to.equal(mongodbDoc.state);
    });
  });

  describe('dataQueryKeys', function() {
    it('should return Model QueryKeys', function() {
      const modelQueryKeys = Model.queryKeys();
      const schemaQueryKeys = Schema.dataQueryKeys();
      expect(_.isEqual(modelQueryKeys, schemaQueryKeys)).to.be.equal(true);
    });
  });
});
