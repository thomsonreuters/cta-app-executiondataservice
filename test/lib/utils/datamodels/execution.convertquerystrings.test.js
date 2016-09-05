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
        starttimestamp: '1000',
        done: 'true',
        notaproperty: 'foobar',
      };
      const expected = {
        id: query.id,
        starttimestamp: 1000,
        done: true,
      };
      const actual = Model.convertQueryStrings(query);
      expect(_.isEqual(actual, expected)).to.be.equal(true);
    });
  });

  context('when cannot parse number (parseInt)', function() {
    it('should return converted query', function() {
      const query = {
        id: (new ObjectID()).toString(),
        starttimestamp: 'foobar',
        done: 'false',
        notaproperty: 'foobar',
      };
      const expected = {
        id: query.id,
        starttimestamp: NaN,
        done: false,
      };
      const actual = Model.convertQueryStrings(query);
      expect(_.isEqual(actual, expected)).to.be.equal(true);
    });
  });
});
