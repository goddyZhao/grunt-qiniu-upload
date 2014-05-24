/*
 * grunt-qiniu-upload
 * https://github.com/goddyzhao/plugin
 *
 * Copyright (c) 2014 Goddy Zhao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var qiniu = require('qiniu');
  var Q = require('Q');
  var path = require('path');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('qiniu_upload', 'qiniu upload grunt task', function() {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    if (!(options.accessKey && options.secretKey)) {
      grunt.fail.fatal('accessKey and secretKey in options are all required!');
    }

    qiniu.conf.ACCESS_KEY = options.accessKey;
    qiniu.conf.SECRET_KEY = options.secretKey;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      if (!f.dest) {
        grunt.fail.fatal('dest is required');
      }

      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else if (!grunt.file.isFile(filepath)){
          return false;
        } else {
          return true;
        }
      });


      var promiseArr = [];
      src.forEach(function (filepath) {
        var absoluteFilePath = filepath;
        if (!grunt.file.isPathAbsolute(filepath)) {
          absoluteFilePath = path.resolve(filepath);
        }

        grunt.log.debug('Generate uptoken');
        var putPolicy = new qiniu.rs.PutPolicy(f.dest + ':' + filepath);
        var token = putPolicy.token();
        grunt.log.debug('Generated upoken');

        grunt.log.writeln('Start uploading ' + filepath);
        var uploadPromise = Q.ninvoke(qiniu.io, 'putFile', token, filepath, absoluteFilePath, null);
        promiseArr.push(uploadPromise);
      });

      grunt.log.writeln('Uploading...');
      Q.all(promiseArr)
      .then(function (rets) {
        rets.forEach(function (ret) {
          grunt.log.writeln('Uploaded ' + ret[0].key);
        });
        done();
      })
      .then(null, function (err) {
        grunt.log.error(err.code);
        grunt.log.error(err.error);
        done(false);
      });
    });
  });

};
