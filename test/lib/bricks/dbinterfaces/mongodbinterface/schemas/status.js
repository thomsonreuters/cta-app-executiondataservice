'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');
const ObjectID = require('bson').ObjectID;

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'status.js'));
const Schema = require(nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/schemas', 'status.js'));


describe('DatabaseInterfaces - MongoDB - Schema - Status', function() {
  describe('constructor', function() {
    const data = {
      id: (new ObjectID()).toString(),
      testId: (new ObjectID()).toString(),
      executionId: (new ObjectID()).toString(),
      timestamp: 1000,
    };
    const status = new Model(data);
    it('should return an StatusSchema', function() {
      const object = new Schema(status);
      expect(object.id).to.not.exist; // eslint-disable-line no-unused-expressions
      expect(object._id).to.be.an.instanceof(ObjectID);
      expect(object._id.toString()).to.equal(status.id);
      expect(object.testId).to.be.an.instanceof(ObjectID);
      expect(object.testId.toString()).to.equal(status.testId);
      expect(object.executionId).to.be.an.instanceof(ObjectID);
      expect(object.executionId.toString()).to.equal(status.executionId);
      expect(object.timestamp).to.equal(status.timestamp);
    });
  });

  describe('toCTAData', function() {
    const mongodbDoc = {
      _id: (new ObjectID()),
      testId: (new ObjectID()),
      executionId: (new ObjectID()),
      timestamp: 1000,
    };
    it('should return an Status', function() {
      const object = Schema.toCTAData(mongodbDoc);
      expect(object).to.be.an.instanceof(Model);
      expect(object._id).to.not.exist; // eslint-disable-line no-unused-expressions
      expect(object.id).to.equal(mongodbDoc._id.toString());
      expect(object.testId).to.equal(mongodbDoc.testId.toString());
      expect(object.executionId).to.equal(mongodbDoc.executionId.toString());
      expect(object.timestamp).to.equal(mongodbDoc.timestamp);
    });
  });

  describe('dataQueryKeys', function() {
    it('should return Execution QueryKeys', function() {
      const modelQueryKeys = Model.queryKeys();
      const schemaQueryKeys = Schema.dataQueryKeys();
      expect(_.isEqual(modelQueryKeys, schemaQueryKeys)).to.be.equal(true);
    });
  });
});
