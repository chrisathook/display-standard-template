'use strict';
// vars
var gulp = require('gulp');
var config = require('./config');
var bs = require('browser-sync').create();
// two more states to minify code and create sourcemaps. The default is for local development.
gulp.task('dev', function (done) {
  config.flags.minify = false;
  config.flags.sourcemap = true;
  config.flags.type = 'dev';
  done();
});
gulp.task('prod', function (done) {
  config.flags.minify = true;
  config.flags.sourcemap = false;
  config.flags.type = 'prod';
  done();
});
// define stackable tasks
gulp.task('clean', require('./tasks/clean')(gulp, config.clean));
gulp.task('sass', require('./tasks/lib-sass')(gulp, bs, config.sass, config.flags));
gulp.task('sprite-collapsed-foreground', require('./tasks/sprite-images')(gulp, bs, config.sprite.collapsed_foreground, config.flags));
gulp.task('sprite-collapsed-background', require('./tasks/sprite-images')(gulp, bs, config.sprite.collapsed_background, config.flags));
gulp.task('sprite-all', gulp.parallel('sprite-collapsed-foreground', 'sprite-collapsed-background'));
// define watch actions
gulp.task('watch', function (done) {
  bs.init({
    server: {
      baseDir: config.server.root
    },
    online: false,
    port: config.server.port,
    reloadDelay: 1000,
    reloadDebounce: 1000,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });
  gulp.watch(config.sass.watch_src, gulp.series('sass')); // only watch files not associated with spritesheets
  // generate new sass partials for spritesheets when images edited
  gulp.watch(config.sprite.collapsed_foreground.src, gulp.series('sprite-collapsed-foreground'));
  gulp.watch(config.sprite.collapsed_background.src, gulp.series('sprite-collapsed-background'));
  done();
});
gulp.task('build-dev', gulp.series('dev', 'clean', gulp.parallel(gulp.series('sprite-all', 'sass'))));
gulp.task('build-prod', gulp.series('prod', 'clean', gulp.parallel(gulp.series('sprite-all', 'sass'))));
gulp.task('watch-dev', gulp.series('dev', 'build-dev', 'watch'));
gulp.task('watch-prod', gulp.series('prod', 'build-prod', 'watch'));
gulp.task('default', gulp.series('watch-dev'));
