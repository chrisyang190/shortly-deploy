module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
        stripBanners: false
      },
      dist: {
        // grabs all files within all subdirectories of public
        src: [ 'public/client/**/*.js'],
        dest: 'public/dist/build.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      },
      options: {
        ignore: ['public/dist/**']
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/output.min.js': ['public/dist/build.js']
        }
      }
    },

    eslint: {
      options: {
        configFile: './node_modules/eslint-config-hackreactor/index.js',
      },
      target: [
        'public/dist/build.js'
      ]
    },

    cssmin: {
      target: {
        files: {
          'public/dist/output.min.css': ['public/*.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify',
          'eslint',
          'mochaTest'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      multiple: {
        command: [
          'git add .',
          'git commit -m "Auto Commit"',
          'git push live master'
        ].join('&&')
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'eslint', 'nodemon' 
  ]);

  // prod runs when 'prod' grunt option is called when upload is queued
  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['shell']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', ['upload', 'eslint', 'nodemon', 
  ]);


};
