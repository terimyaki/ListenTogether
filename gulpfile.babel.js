import path from 'path';
import cp from 'child_process';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import del from 'del';
import mkdirp from 'mkdirp';
import gulpLoadPlugins from 'gulp-load-plugins';

import config from './webpack.config';
const plugins = gulpLoadPlugins();
const src = {
	background: ['src/background/*.js'],
	popup : ['src/popup/*.html'],
	popupjs : [
		'src/popup/**/*.jsx',
		'src/popup/**/**/*.jsx',
		'src/popup/*.js',
		'src/popup/*.scss'
	],
	contentjs: ['src/content/*.js'],
	extension: ['src/manifest.json']
};

gulp.task('clean', (cb) => {
	del(['build'], null, () => {
		mkdirp('build/content', function(){
			mkdirp('build/popup', cb);
		});
	});
});

gulp.task('build:popup', () => {
	gulp.src(src.popup)
		.pipe(plugins.changed('build/popup'))
		.pipe(plugins.minifyHtml())
		.pipe(gulp.dest('build/popup'));
});

gulp.task('build:extension', () => {
	gulp.src(src.extension)
		.pipe(plugins.changed('build'))
		.pipe(gulp.dest('build'));
});

gulp.task('watch', () => {
	gulp.watch(src.popup, ['build:popup']);
	gulp.watch(src.extension, ['build:extension']);
	gulp.watch(src.popupjs, ['bundle:popup']);
	gulp.watch(src.contentjs, ['bundle:content']);

});

gulp.task('bundle:content', cb => {
	function bundle(err, stats){
		if(err) throw new plugins.util.PluginError('webpack', err);
		plugins.util.log(stats.toString({
            colors: plugins.util.colors.supportsColor
        }));
        cb();
	}

	webpack(config.contentConfig).run(bundle);
});

gulp.task('bundle:popup', cb => {
	function bundle(err, stats){
		if(err) throw new plugins.util.PluginError('webpack', err);
		plugins.util.log(stats.toString({
            colors: plugins.util.colors.supportsColor
        }));
        cb();
	}

	webpack(config.popupConfig).run(bundle);
});

gulp.task('bundle:background', cb => {
	function bundle(err, stats){
		if(err) throw new plugins.util.PluginError('webpack', err);
		plugins.util.log(stats.toString({
            colors: plugins.util.colors.supportsColor
        }));
        cb();
	}

	webpack(config.backgroundConfig).run(bundle);
});

gulp.task('build', ['clean'], cb => {
	runSequence(['build:extension', 'build:popup'], ['bundle:popup','bundle:content', 'bundle:background']);
});

gulp.task('serve', cb => {
	gulp.start('build');
	gulp.watch(src.extension, ['build:extension']);
	gulp.watch(src.background, ['bundle:background']);
	gulp.watch(src.popup, ['build:popup']);
	gulp.watch(src.popupjs, ['bundle:popup']);
	gulp.watch(src.contentjs, ['bundle:content']);
});

gulp.task('default', ['serve']);