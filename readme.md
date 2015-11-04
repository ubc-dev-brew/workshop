# Workshop

## Gulp
Gulp is used for compiling, minifying, and concatenating SASS and Javascript.

### SASS
To compile SASS, use `gulp sass`. This will search the `./public/css/src` directory recursively for SASS files, compile, minify, and concatenate them, then place a single CSS file called 'main.min.css' in the `./public/css/dist` directory. To compile SASS, but skip the minification and concatenation process, use `gulp sass -d`. This will produce one compiled CSS file in the `./public/css/dist` directory for each source SASS file. SASS files prepended with an underscore will be ignored.

### Javascript
To compile Javascript, use `gulp js`. This will search the `./public/js/src` directory non-recursively for Javascript files, browserify, concatenate, and minify them, then place a single Javascript file called 'main.min.js' in the `./public/js/dist` directory. To browserify each source file as an individual bundle and skip the minification process, use `gulp js -d`. This will produce one browserified Javascript file in the `./public/js/dist` directory for each source Javascript file.