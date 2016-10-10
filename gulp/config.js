'use strict';
var dest = '.';
var config = {
  flags: {
    minify: false,
    sourcemap: true,
    type: 'dev'
  },
  clean: {
    src: dest + '/**/*'
  },
  styles: {
    src: './styles/**/*',
    entry: './styles/index.styl',
    dist: dest + '/css/'
  },
  html: {
    src: './static/html/**/!(*.fla|*.md)',
    entry: './static/html/index.html',
    dist: dest
  },
  sass: {
    src: './sass/**/*.scss',
    watch_src: ['./sass/**/*.scss', '!./sass/spritesheets/**/*.scss'],
    image_src: './static/toSprite/**/*.{gif,jpg,png,svg}',
    dist: dest + '/css/'
  },
  images: {
    src: './static/images/**/*.{gif,jpg,png,svg}',
    dist: dest + '/images/'
  },
  sprite: {
    collapsed_foreground: {
      src: './_toSprite/collapsed/foreground/**/*.png',
      dist_img: dest + '/images/',
      dist_css: './sass/spritesheets',
      prefix: 'collapsed-foreground',
      jpg_conversion:false
    },
    collapsed_background: {
      src: './_toSprite/collapsed/background/**/*.png',
      dist_img: dest + '/images/',
      dist_css: './sass/spritesheets',
      prefix: 'collapsed-background',
      jpg_conversion:true
    }
    ,
    optimize:{

      src: dest + '/images/**/*-sprite.png',
      dist: dest + '/images/',
      quality:80
    }
  },
  scripts: {
    app: {
      src: './app/**/*.js',
      entry: './app/index.js'
    },
    dist: dest + '/js/'
  },
  vendor: {
    src: './vendor/**/*.js',
    dist: dest + '/vendor'
  },
  optimize: {
    css: {
      src: dest + '/**/*.css'
    },
    js: {
      src: dest + '/**/*.js'
    },
    html: {
      src: dest + '/**/*.html'
    },
    dist: dest
  },
  server: {
    root: dest,
    port: 8080
  }
};
module.exports = config;