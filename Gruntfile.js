module.exports = function (grunt){

    grunt.initConfig({
        watch : {

        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('dev',[
        'watch'
    ]);

    grunt.registerTask('pro',[
    ]);
};