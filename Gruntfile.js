module.exports = function (grunt){

    require('load-grunt-tasks')(grunt);

    var xlessJSFiles = [
        'src/xless.js',
        'src/foundation/bounce/bounce.js'
    ];

    var xlessCssFiles = [
        'src/foundation/bounce/bounce.css'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch : {
            xlessJs : {
                files: xlessJSFiles,
                tasks: ['uglify']
            },
            xlessCss : {
                files: xlessCssFiles,
                tasks : ['concat', 'autoprefixer']
            }
        },
        concat : {
            xlessCss: {
                src: [ 'src/foundation/**/*.css' ],
                dest: 'temp/xless.tmp.css'
            }
        },
        uglify : {
            options : {
                sourceMap : true
            },
            xless : {
                files : {
                    'build/xless.min.js': xlessJSFiles
                }
            }
        },
        autoprefixer : {
            options : {
                browsers: ['last 2 versions', 'bb 10']
            },
            cssPrefixer: {
                src: 'temp/xless.tmp.css',
                dest : 'build/xless.css'
            }
        }
    });

    grunt.registerTask('dev',[
        'watch'
    ]);

    grunt.registerTask('pro',[
        'uglify', 'concat', 'autoprefixer'
    ]);
};