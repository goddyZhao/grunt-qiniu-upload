/*
 * grunt-qiniu-upload
 * https://github.com/goddyzhao/plugin
 *
 * Copyright (c) 2014 Goddy Zhao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    qiniu_upload: {
      file:  {
        options: {
          accessKey: '', // fill your access key of qiniu
          secretKey: ''  // fill your secret key of qiniu
        },
        files: {
          'grunt-qiniu': ['test/fixtures/a.js']
        }
      },

      directory: {
        options: {
          accessKey: '', // fill your access key of qiniu
          secretKey: ''  // fill your secret key of qiniu
        },

        files: {
          'grunt-qiniu': ['test/fixtures/d/**']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'qiniu_upload', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
