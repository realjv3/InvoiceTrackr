Invoicing web app made with React + MaterialUI front-end and Laravel backend. 
![screen shot](http://res.cloudinary.com/realjv3/image/upload/v1503530734/invoicetrackr_vdboz4.png)

If you just want to stand up an instance of the app:
1. Clone this repository into the project directory.  
1. Execute <pre> "composer install --no-dev"</pre> from command line.
1. If you don't want to do any coding, continue to below section 'To setup, migrate and seed a mysql database'

If you want to develop and not just stand up an instance, do these additional steps (requires [node.js](https://nodejs.org/) and [composer](https://getcomposer.org/)). If using Vagrant to spin up a dev server, skip ahead to Vagrant section below.   
1. From project root, run <pre>npm install --only=dev</pre>  to install webpack, react, mui, etc.
1. From project root, execute <pre>composer-install</pre> to install the dev dependencies.

The React components for the front end are in the /resources/assets/js folder.  
webpack.config.js is all set to bundle those React components and put them where they need to be (/public/js).
You will need to use [webpack](https://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/) to transpile and bundle these javascript files.

If you want to use Vagrant:
1. create an nginx.conf file in proj. root, then edit path to it in the Vagrantfile:102.  
1. <pre>vagrant up  --provision</pre> will install and config a LEMP stack, plus xdebug, git and ftp. 
1. <pre>vagrant ssh</pre> to ssh into the new server

To setup, migrate and seed a mysql database:
1. execute <pre>sudo apt-get install -y mysql-server-5.5 mysql-client</pre> from console
1. go through <pre>mysql_secure_installation</pre>
1. create and configure database
1. create Laravel .env file
1. run database migrations from command line <pre>php artisan migrate</pre>
1. Open web page, hit "Login\Register", submit form to register a new user
1. On transactions page, input a new customer
1. run database seeding from command line <pre>php artisan db:seed</pre>