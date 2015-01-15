/*
 * grunt-git
 * https://github.com/rubenv/grunt-git
 *
 * Copyright (c) 2013 Ruben Vermeersch
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                'tests/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },
        jscs: {
            src: {
                options: {
                    config: '.jscs.json'
                },
                files: {
                    src: [
                        'Gruntfile.js',
                        'tasks/*.js',
                        'tests/*.js',
                    ],
                }
            },
        },
        mochacli: {
            options: {
                files: 'tests/*_test.js'
            },
            spec: {
                options: {
                    reporter: 'spec',
                    timeout: 10000
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                commitFiles: ['-a'],
                pushTo: 'origin'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs-checker');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-bump');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['jshint', 'jscs', 'mochacli']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['test']);

};
