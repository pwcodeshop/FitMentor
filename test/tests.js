var chai = require("chai");
var assert = chai.assert;

var user = require('../models/user');
var listing = require('../models/listing');
var comment = require('../models/comment');

describe('user schema', function() {
  it('should be defined', function(){
      assert.isDefined(user, 'schema is defined');
  }); 
});

describe('listing schema', function() {
  it('should be defined', function(){
      assert.isDefined(listing, 'schema is defined');
  }); 
});

describe('comment schema', function() {
  it('should be defined', function(){
      assert.isDefined(comment, 'schema is defined');
  }); 
});
