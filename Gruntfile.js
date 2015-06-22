
module.exports = function (grunt) {
    'use strict';

    // load extern tasks
    grunt.loadNpmTasks('grunt-update-json');
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-symlink');

    // tasks
    grunt.initConfig({

        coreReposConfig : grunt.file.readJSON('core-repos-config.json'),

// ---------------------------------------------
//                               configure tasks
// ---------------------------------------------
        symlink: {
            // Enable overwrite to delete symlinks before recreating them
            options: {
                overwrite: false
            },
            // The "build/target.txt" symlink will be created and linked to
            // "source/target.txt". It should appear like this in a file listing:
            // build/target.txt -> ../source/target.txt
            coreBackend: {
                src: '<%= coreReposConfig.coreBackendRepoPath %>',
                dest: 't6s-core/core-backend'
            }
        },

        update_json: {
            packageBuild: {
                src: ['t6s-core/core-backend/package.json', 'package.json'],
                dest: 'package-tmp.json',
                fields: [
                    'name',
                    'version',
                    'dependencies',
                    'devDependencies',
                    'overrides'
                ]
            },
            packageHeroku: {
              src: ['t6s-core/core-backend/package.json'],
              dest: 'heroku/package.json',
              fields: [
                'name',
                'version',
                'dependencies',
                'devDependencies',
                'overrides'
              ]
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                          build and dist tasks
// ---------------------------------------------
        copy: {
            buildPackageBak: {
                files: 	[{'package-bak.json': 'package.json'}]
            },
            buildPackageReplace: {
                files: 	[{'package.json': 'package-tmp.json'}]
            },
            buildPackageReinit: {
                files: 	[{'package.json': 'package-bak.json'}]
            },
            heroku: {
              files: 	[{expand: true, cwd: 'build', src: ['**'], dest: 'heroku'}]
            },
            herokuProcfile: {
              files: 	[{expand: true, cwd: 't6s-core/core-backend', src: ['Procfile'], dest: 'heroku'}]
            }
        },

        typescript: {
            build: {
                src: [
                    'scripts/**/*.ts'
                ],
                dest: 'build/js/Service.js'
            },
            test: {
                src: [
                    'tests/**/*.ts'
                ],
                dest: 'build/tests/Test.js'
            }
        },

        express: {
            options: {
                port: 6011
            },
            build: {
                options: {
                    script: 'build/js/Service.js',
                    args: ["loglevel=debug"]
                }
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 develop tasks
// ---------------------------------------------
        watch: {
            express: {
                files:  [ 'build/js/Service.js' ],
                tasks:  [ 'express:build' ],
                options: {
                    spawn: false
                }
            },

            developServer: {
                files: ['scripts/**/*.ts'],
                tasks: ['typescript:build']
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 doc tasks
// ---------------------------------------------
        yuidoc: {
            compile: {
                name: 'The 6th Screen - Vigiglobe Service',
                description: 'Vigiglobe Service for The 6th Screen products.',
                version: '0.0.1',
                url: 'http://www.the6thscreen.fr',
                options: {
                    extension: '.ts, .js',
                    paths: ['scripts/'],
                    outdir: 'doc/'
                }
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 test tasks
// ---------------------------------------------
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    colors: true,
                    require: 'coverage/blanket'
                },
                src: ['build/tests/Test.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'coverage.html'
                },
                src: ['build/tests/Test.js']
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                    clean task
// ---------------------------------------------
        clean: {
            package: ['package-bak.json', 'package-tmp.json'],
            build: ['build/'],
            heroku: ['heroku/'],
            doc: ['doc'],
            test: ['build/tests/Test.js']
        }
// ---------------------------------------------
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('init', ['symlink']);

    grunt.registerTask('build', function () {
        grunt.task.run(['clean:package', 'clean:build']);

        grunt.task.run(['update_json:packageBuild', 'copy:buildPackageBak', 'copy:buildPackageReplace', 'npm-install', 'copy:buildPackageReinit', 'typescript:build', 'clean:package']);
    });

    grunt.registerTask('heroku', function () {
      grunt.task.run(['clean:heroku']);

      grunt.task.run(['build', 'update_json:packageHeroku', 'copy:heroku', 'copy:herokuProcfile']);
    });

    grunt.registerTask('develop', ['build', 'express:build', 'watch']);

    grunt.registerTask('doc', ['clean:doc', 'yuidoc']);

    grunt.registerTask('test', function() {
        grunt.task.run(['clean:package', 'clean:test']);

        grunt.task.run(['update_json:packageBuild', 'copy:buildPackageBak', 'copy:buildPackageReplace', 'npm-install', 'copy:buildPackageReinit', 'typescript:test', 'mochaTest:test']);
    });

    grunt.registerTask('coverage', ['test', 'mochaTest:coverage']);

}

