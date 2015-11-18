var gulp = require('gulp');
var jade = require('gulp-jade');
var bower = require('gulp-bower');
var bowerFiles = require('main-bower-files')
var sass = require('gulp-sass');
var notify 		= require('gulp-notify');
var inject = require('gulp-inject');
var browserSync = require('browser-sync');
var es = require('event-stream');
var reload 		= browserSync.reload;
var ghPages		= require('gulp-gh-pages');


// move scripts to the js folder in /public
gulp.task('assets', function(){
	return gulp.src('./src/assets/*')
	.pipe(gulp.dest('./public/src/assets'));
})

// move scripts to the js folder in /public
gulp.task('scripts',['assets'], function(){
	return gulp.src('./src/js/**/*.js')
	.pipe(gulp.dest('./public/src/js'));
})


//compile jade, catch errors before compile. 
gulp.task('jade',['scripts'], function () {
	var j = jade({
		pretty: true
	});
	j.on('error', function(err){
		console.log(err);
		notify().write("jade error");
		j.end();
		gulp.watch();
	})
	return gulp.src('./src/jade/*.jade')
	.pipe(j)
	.pipe(gulp.dest('./src/jade/temp'));
});


// Move the index file to public
gulp.task('index',['jade'], function(){
	return gulp.src('./src/jade/temp/index.html')
	.pipe(gulp.dest('./public'))
})

// compile SCSS
gulp.task('build',['index'], function(){
	return gulp.src('./src/scss/*.scss')
		.pipe(sass({
			style: 'compressed',
			errLogToConsole: false,
			onError: function(err){
				return notify().write(err);
			}
		}))
		.pipe(gulp.dest('./public/src/css'))
		.pipe(browserSync.stream());
})


// inject bower and other dependancied into index.html
gulp.task('inject', ['build'], function(){
  gulp.src('./public/index.html')

  	.pipe(inject(gulp.src(bowerFiles({paths:{bowerDirectory:'./public/src/lib'}}), {read: false}), {name: 'bower', relative: true}))
  	.pipe(inject(es.merge(
  		// gulp.src(bowerFiles(/*options*/{paths:{bowerDirectory:'./public/src/lib'}}), {read: false}), 
    	gulp.src('./public/src/js/*.js', {read: false}),
    	gulp.src('./public/src/css/*.css', {read: false}) 
	  ),{relative: true}))

  	.pipe(gulp.dest('./public'));
});


//move bower components to the library folder
gulp.task('bower', function(){
	return bower()
		.pipe(gulp.dest('./public/src/lib/'));
});

//compile on change
gulp.task('watch', function(){
	gulp.watch(['./src/scss/*.scss', './src/jade/*.jade', 'src/js/*.js'], ['inject']);
});

//serve to the browser
gulp.task('serve', function(){
	browserSync.init(['./public/index.html'],{
		server: {
			baseDir: "./public"
		},
		open: false
	})
});

//the dafault task
gulp.task('default', ['bower', 'inject', 'watch', 'serve'], function(){
	console.log('Starting gulp...');
});


//deploy to github-pages
gulp.task('deploy', function(){
	return gulp.src('./public/**/*')
		.pipe(ghPages());
});
