![alt tag](https://www.dropbox.com/s/y1mija5xpu82w2m/invoicetrackr.png?dl=1)
Invoicing web app made with React + MaterialUI front-end and Laravel backend. 

Clone this repository into the project directory.
Execute "composer install --no-dev" from command line.
Create a mysql database.
Create a .env file for Laravel in app root directory.
Run the database migrations & seeding with "php artisan migrate" and "php artisan db:seed".

If you want to develop, run "npm install --only=dev" to install webpack, react, mui, etc.
The React components for the front end are in the /resources/assets/js folder.
webpack.config.js is all set to bundle those React components and put them where they need to be (/public/js).

If you want to use Vagrant, create nginx.conf in proj. root, update paths in the Vagrantfile.
Vagrant will install and config a LEMP stack, plus git and ftp. 
Mysql stuff has to be done manually for now:
vagrant up --provision
vagrant ssh
sudo apt-get install -y mysql-server-5.5 mysql-client
mysql_secure_installation
..then create a database, set .env file, run database migrations