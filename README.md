# Display Standard Banner Templates

A Standard Media Template System. The templates support most major AdKit platforms. The templates are provided as source and are intended to be compiled with the [Display Standard Previewer](https://github.com/chrisathook/display-standard-previewer). See the documentation there on how to compile the units.

## Dependencies

* Node - Globals
    * Browserify
    * Gulp 4

### Gulp 4 Install

If you don't have gulp 4 installed globally do the following.

`npm install gulpjs/gulp-cli -g`

`npm install github:gulpjs/gulp#4.0 -g`


## Implementation Notes

### Styles and Spriteing

System uses sass and for all styling and LibSass for compilation. All styles go in /sass/style.scss.

spritesheet images should be kept separate and placed in static/toSprite. The system supports 2 spritesheets. The **foreground sheet** is compiled as a .png to support transparency. The **background sheet** is compiled as a .jpg and is intended for images without transparency. The 2 images are compiled and placed in */images* with the file names collapsed-background-sprite.jpg and collapsed-foreground-sprite.png. In the case of the background jpg the original png is also provided in */images/_assets* in case the default jpeg compression isn't suitable.

when new images are placed in *static/_toSprite* the spritesheets and their sass partials need to be recompiled before they can be used. The previewer provides support for this. Each spritesheet is searchable in sass using the custom spriting mixins. You need to provide the variable name of the spritesheet and the original image name in order to find the sprite. There are custom functions to use sprites as retina or standard resolution. Examples can be found in **style.scss**.

#### Spriteing Mixins

2 custom mixins are provided to use the images in the spritesheet at either 1X or 2X Retina resolutions. Each function takes the name of the sass variable that holds the map data and the name of the original file without the extension.

`sprite ($collapsed-background-map, 'keep');`

`sprite-retina ($collapsed-background-map, 'keep')`

#### SASS Mixins

Utility Mixins are provided by [compass-mixins](https://github.com/Igosuki/compass-mixins). These mixins are for the LibSass compiler while trying to be as close as possible to the original [Ruby Compass Mixins](http://compass-style.org/reference/compass/css3/).

### Images

images for the spritesheets should go in */_toSprite*. Regular images go in */images*. No image optimization is done at any time. Image optimization must be done by hand.

### Javascript

All Javascript goes in */libs*. **Ad.js** is the entry point and **Animation.js** is where all the animation should be done. Place all 3rd party libs in */libs/vendor*.

#### Javascript Concatenation
The system combines all local JS files during the final build. Any files included between the 2 html comments `<!-- build:js combined.js -->` and `<!-- endbuild -->` will be combined in the order they are specified in index.html.

><!-- build:js combined.js -->

><script src="libs/vendor/bowser.min.js"></script>

><script src="libs/vendor/greensock/TweenMax.min.js"></script>

><script src="libs/Animation.js"></script>

><script src="libs/Ad.js"></script>

><!-- endbuild -->

#### Platform Detection

Platform detection is provided by [bowser.js](https://github.com/ded/bowser).

### Configuring The Ad

All kit specific items are in */_kit-specific-html* in the folder for that kit. Copy the entire contents of the kit folder into the root of the project to use the template with a specific kit.

#### Setting ClickTag Variables

If a kit requires a clicktag URL that URL can be set in `clickHandler` in *index.html*.

#### Setting Dimensions

Dimensions need to be set in 2 places.

* index.html : <meta name="ad.size" content="width=300,height=250">
* /sass/styles.scss : $collapsed-width: 300px; $collapsed-height: 250px;

If you are using the FT version of the template then the size must also be set in /manifest.js

### linting

The template includes a configuration file for use with sass-lint based linters.

#### Install Linter for [ATOM IDE](https://atom.io/)

* install Atom
* In a terminal enter `apm install linter` then `apm install linter-sass-lint`