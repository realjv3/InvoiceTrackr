### Invoicing web app made with React + MaterialUI front-end and Laravel backend. 
![screen shot](http://res.cloudinary.com/realjv3/image/upload/v1517076995/InvoiceTrackr-screenshot_yerdmo.png)

##### If you just want to stand up an instance of the app:
1. Clone this repository into the project directory.  
2. Execute ` "composer install --no-dev"` from command line.
3. If you don't want to do any coding, continue to below section 'To setup, migrate and seed a mysql database'

##### If you want to develop and not just stand up an instance, do these additional steps (requires [node.js](https://nodejs.org/) and [composer](https://getcomposer.org/)). 
_If using Vagrant to spin up a dev server, skip ahead to Vagrant section below._   
1. From project root, run `npm install --only=dev`  to install webpack, react, mui, etc.
2. From project root, execute `composer-install` to install the dev dependencies.

The React components for the front end are in the /resources/assets/js folder.  
webpack.common.js is all set to bundle those React components and put them where they need to be (/public/js).
You will need to use [webpack](https://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/) to transpile and bundle these javascript files.
When developing, run `npm run develop` on the dev server. This launches webpack, which will watch the jsx files and re-bundle & output them them to public/js/xyz.js as changes are made to the jsx files.

##### If you want to use Vagrant:
1. create an nginx.conf file in proj. root, then edit path to it in the Vagrantfile:102.  
2. `vagrant up  --provision` will install and config a LEMP stack, plus xdebug, git and ftp. 
3. `vagrant ssh` to ssh into the new server

##### To setup, migrate and seed a mysql database:
1. execute `sudo apt-get install -y mysql-server-5.5 mysql-client` from console
2. go through `mysql_secure_installation`
3. create and configure database
4. create Laravel .env file
5. run database migrations from command line `php artisan migrate`
6. Open web page, hit "Login\Register", submit form to register a new user
7. On transactions page, input a new customer
8. run database seeding from command line `php artisan db:seed`

##### Deploying to production
1. on prod server, execute `php artisan down`
2. set `APP_ENV=production` in .env file
3. run `npm run build` from command line. This will set NODE_ENV to 'production' and use UglifyJS to out minified bundled javascript, css and whatnot.
4. git pull changes to deploy PHP changes, run database migrations & seeding for DDL or DML changes, `composer install --no-dev`, then ftp vendor folder to prod server  
On prod server:
5. run `composer install --optimize-autoloader` so Composer can autoload classes more efficiently
6. run `php artisan route:cache` which will optimize route loading
7. run `php artisan config:cache` which will combine all of Laravel's config files into one file
8. run `php artisan route:cache` which will optimize route loading
8. run `php artisan up`