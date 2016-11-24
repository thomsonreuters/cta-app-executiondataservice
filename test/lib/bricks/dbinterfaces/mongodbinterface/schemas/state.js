'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');
const ObjectID = require('bson').ObjectID;

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'state.js'));
const Schema = require(nodepath.join(appRootPath,
  '/lib/bricks/dbinterfaces/mongodbinterface/schemas', 'state.js'));


describe('DatabaseInterfaces - MongoDB - Schema - State', function() {
  describe('constructor', function() {
    const data = {
      id: (new ObjectID()).toString(),
      executionId: (new ObjectID()).toString(),
      timestamp: 1000,
    };
    const state = new Model(data);
    it('should return an StateSchema', function() {
      const object = new Schema(state);
      expect(object.id).to.not.exist; // eslint-disable-line no-unused-expressions
      expect(object._id).to.be.an.instanceof(ObjectID);
      expect(object._id.toString()).to.equal(state.id);
      expect(object.executionId).to.be.an.instanceof(ObjectID);
      expect(object.executionId.toString()).to.equal(state.executionId);
      expect(object.timestamp).to.equal(state.timestamp);
    });
  });

  describe('toCTAData', function() {
    const mongodbDoc = {
      _id: (new ObjectID()),
      executionId: (new ObjectID()),
      timestamp: 1000,
    };
    it('should return a State', function() {
      const object = Schema.toCTAData(mongodbDoc);
      expect(object).to.be.an.instanceof(Model);
      expect(object._id).to.not.exist; // eslint-disable-line no-unused-expressions
      expect(object.id).to.equal(mongodbDoc._id.toString());
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
