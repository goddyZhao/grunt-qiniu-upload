'use strict';

var grunt = require('grunt');
var request = require('request');
var Q = require('q');
var bucket = 'grunt-qiniu'; // please replace it with yours
var qiniuBaseUrl = 'http://' + bucket + '.qiniudn.com';

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.qiniu_upload = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  file: function(test) {
    test.expect(1);

    var resourceUrl = qiniuBaseUrl + '/test/fixtures/a.js';
    request(resourceUrl, function (err, response, body) {
      if (!err && response.statusCode === 200) {
        var expected = grunt.file.read('test/expected/a.js');
        test.equal(body, expected, 'a.js should be uploaded successfully');

        test.done();
      }
    });
  },

  directory: function(test) {
    test.expect(2);

    var resourceUrl = qiniuBaseUrl + '/test/fixtures/d/d.js';
    Q.nfcall(request, resourceUrl)
    .then(function (ret) {
      var response = ret[0];
      var body = ret[1];
      if (response.statusCode === 200) {
        var expected = grunt.file.read('test/expected/d/d.js');
        test.equal(body, expected, 'd.js should be uploaded successfully');

        resourceUrl = qiniuBaseUrl + '/test/fixtures/d/dd/dd.js';
        return Q.nfcall(request, resourceUrl);
      }
    })
    .then(function (ret) {
      var response = ret[0];
      var body = ret[1];
      if (response.statusCode === 200) {
        var expected = grunt.file.read('test/expected/d/dd/dd.js');
        test.equal(body, expected, 'dd.js should be uploaded successfully');
        test.done();
      }
    })
    .then(null, function (err) {
      grunt.log.error(err.message);
      test.done(false);
    });
  }
};
