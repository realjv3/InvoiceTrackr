### Invoicing web app made with React + MaterialUI front-end and Laravel backend. 
![screen shot](http://res.cloudinary.com/realjv3/image/upload/v1503530734/invoicetrackr_vdboz4.png)

##### If you just want to stand up an instance of the app:
1. Clone this repository into the project directory.  
2. Execute <code> "composer install --no-dev"</code> from command line.
3. If you don't want to do any coding, continue to below section 'To setup, migrate and seed a mysql database'

##### If you want to develop and not just stand up an instance, do these additional steps (requires [node.js](https://nodejs.org/) and [composer](https://getcomposer.org/)). 
_If using Vagrant to spin up a dev server, skip ahead to Vagrant section below._   
1. From project root, run <code>npm install --only=dev</code>  to install webpack, react, mui, etc.
2. From project root, execute <code>composer-install</code> to install the dev dependencies.

The React components for the front end are in the /resources/assets/js folder.  
webpack.common.js is all set to bundle those React components and put them where they need to be (/public/js).
You will need to use [webpack](https://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/) to transpile and bundle these javascript files.
When developing, run <code>npm run develop</code> on the dev server. This launch webpack, which will watch the jsx files and re-bundle & output them them to public/js/xyz.js as changes are made to the jsx files.

##### If you want to use Vagrant:
1. create an nginx.conf file in proj. root, then edit path to it in the Vagrantfile:102.  
2. <code>vagrant up  --provision</code> will install and config a LEMP stack, plus xdebug, git and ftp. 
3. <code>vagrant ssh</code> to ssh into the new server

##### To setup, migrate and seed a mysql database:
1. execute <code>sudo apt-get install -y mysql-server-5.5 mysql-client</code> from console
2. go through <code>mysql_secure_installation</code>
3. create and configure database
4. create Laravel .env file
5. run database migrations from command line <code>php artisan migrate</code>
6. Open web page, hit "Login\Register", submit form to register a new user
7. On transactions page, input a new customer
8. run database seeding from command line <code>php artisan db:seed</code>

##### Deploying to production
1. set <code>APP_ENV=production</code> in .env file
2. run <code>php artisan route:cache</code> which will optimize route loading
3. run <code>npm run build</code> from command line. This will set NODE_ENV to 'production' and use UglifyJS to out minified bundled javascript, css and whatnot.
4. run <code>composer install --optimize-autoloader</code> so Composer can autoload classes more efficiently
5. run <code>php artisan config:cache</code> which will combine all of Laravel's config files into one file
6. run <code>php artisan route:cache</code> which will optimize route loading
7. git pull changes to deploy PHP changes, run database migrations & seeding for DDL or DML changes, ftp vendor and node_modules folders