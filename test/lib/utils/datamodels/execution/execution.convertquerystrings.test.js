'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'execution.js'));

describe('Data Model - Execution - ConvertQueryStrings', function() {
  context('when everything ok', function() {
    it('should return converted query', function() {
      const query = {
        id: (new ObjectID()).toString(),
        startTimestamp: '1000',
        notaproperty: 'foobar',
      };
      const expected = {
        id: query.id,
        startTimestamp: 1000,
      };
      const actual = Model.convertQueryStrings(query);
      expect(_.isEqual(actual, expected)).to.be.equal(true);
    });
  });

  context('when cannot parse number (parseInt)', function() {
    it('should return converted query', function() {
      const query = {
        id: (new ObjectID()).toString(),
        startTimestamp: 'foobar',
        notaproperty: 'foobar',
      };
      const expected = {
        id: query.id,
        startTimestamp: NaN,
      };
      const actual = Model.convertQueryStrings(query);
      expect(_.isEqual(actual, expected)).to.be.equal(true);
    });
  });
});
