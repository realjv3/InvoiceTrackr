# do_stuff
To do list
Using React + MaterialUI front-end and Laravel backend.
composer create-project laravel/laravel [target dir] --prefer-dist to install Laravel in your project directory;
Then clone this repository into the project directory.

To webpack assets if you want to develop, requires node.js installation which should include npm.
Browse to application root.
npm install material-ui //delete .babelrc once installed
npm install -g webpack
npm install webpack
npm install babel-loader babel-core
npm install babel-preset-react
npm install style-loader
npm install css-loader

Running these commands will put these packages in node_modules directory. Run webpack to from app dir to create new bundle.js