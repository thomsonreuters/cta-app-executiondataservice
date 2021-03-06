'use strict';

const appRootPath = require('cta-common').root('cta-app-executiondataservice');
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const Model = require(nodepath.join(appRootPath,
  '/lib/utils/datamodels', 'states.js'));

describe('Data Model - State - ConvertQueryStrings', function() {
  context('when everything ok', function() {
    it('should return converted query', function() {
      const query = {
        id: (new ObjectID()).toString(),
        timestamp: '1000',
        notaproperty: 'foobar',
      };
      const expected = {
        id: query.id,
        timestamp: 1000,
      };
      const actual = Model.convertQueryStrings(query);
      expect(_.isEqual(actual, expected)).to.be.equal(true);
    });
  });

  context('when cannot parse number (parseInt)', function() {
    it('should return converted query', function() {
      const query = {
        id: (new ObjectID()).toString(),
        timestamp: 'foobar',
        notaproperty: 'foobar',
      };
      const expected = {
        id: query.id,
        timestamp: NaN,
      };
      const actual = Model.convertQueryStrings(query);
      expect(_.isEqual(actual, expected)).to.be.equal(true);
    });
  });
});
