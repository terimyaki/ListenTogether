var gulp = require('gulp');

var paths = {
	popup : 'src/popup/*',
	content : 'src/content/*',
	extension: 'src/**/*'
};

gulp.task('buildPopup', function(){
	gulp.src(paths.popup)
		.pipe(gulp.dest('extension/popup'));
});

gulp.task('buildContent', function(){
	gulp.src(paths.content)
		.pipe(gulp.dest('extension/content'));
});

gulp.task('buildExtension', ['buildPopup', 'buildContent']);

gulp.task('default', function(){
	gulp.start('buildExtension');
	gulp.watch(paths.extension, ['buildExtension']);
});