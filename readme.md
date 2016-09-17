![alt tag](https://www.dropbox.com/s/y1mija5xpu82w2m/invoicetrackr.png?dl=1)
Invoicing web app made with React + MaterialUI front-end and Laravel backend. 

Clone this repository into the project directory, then execute "composer install --no-dev" from command line.
Create a .env file for Laravel in app root directory.
Run the database migrations with "php artisan migrate".

If you want to develop, run "npm install --only=dev" to install webpack, react, mui, etc.
The React components for the front end are in the /resources/assets/js folder.
webpack.config.js is all set to bundle those React components and put them where they need to be (/public/js).