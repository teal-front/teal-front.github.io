
var gulp = require('gulp')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var watch = require('gulp-watch')


// todo 建个http server来引入js文件，打断点看支不支持
gulp.task('default', function () {
	gulp.src('src/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('./sourcemaps/', {
			// sourceMappingURL: function (file) {
			// 	return 'http://m.jumi18.com/js/' + file.relative + '.map'
			// }
		}))
		.pipe(gulp.dest('dist/js'))

})