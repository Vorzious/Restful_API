var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gulpMocha = require('gulp-mocha');

    gulp.task('default', function(){
        nodemon({
            script: "app.js", // What script to run
            ext: "js", // What extension to look for
            env: {
                PORT: 8000
            },
            ignore: ['./node_modules/**']
        })
        .on('restart', function(){
            console.log("Restarting...");
        });
    });

    gulp.task('test', function(){
        gulp.src('Tests/*.js', {completed: false})
        .pipe(gulpMocha({reporter: 'nyan'}));
    });
