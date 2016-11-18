# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/trusty64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 80, host: 80

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  # Customize the amount of memory on the VM:
     vb.memory = "3072"
  end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-'EOL'
    echo '#';
    echo '###################### Installing git & ftp ######################'
    echo '#';
    sudo apt-get update -y;
    sudo apt-get install -y git vsftpd;
    sudo mv /etc/vsftpd.conf /etc/vsftpd.conf.default;
    sudo touch /etc/vsftpd.conf && sudo chown root:root /etc/vsftpd.conf;
    sudo chmod 544 /etc/vsftpd.conf;
    sudo sed 's/#write_enable=YES/write_enable=YES/' </etc/vsftpd.conf.default >/etc/vsftpd.conf;

    echo '#';
    echo '###################### Clone repo into project root ######################'
    echo '#';
    sudo mkdir /var/www; cd /var/www;
    sudo git clone 'https://github.com/realjv3/invoicetrackr.git';
    sudo chown -R www-data:www-data /var/www/invoicetrackr && sudo chmod -R 664 /var/www/invoicetrackr && sudo find /var/www/invoicetrackr -type d -exec chmod 775 {} \;
    sudo cp /vagrant/.env /var/www/invoicetrackr;

    echo '#';
    echo '###################### Installing nginx ######################'
    echo '#';
    sudo apt-get install -y nginx;
    sudo service nginx stop;

    echo '#';
    echo '###################### Installing PHP 7.0 & deps ######################'
    echo '#';
    sudo apt-add-repository -y ppa:ondrej/php
    sudo apt-get update -y;
    sudo apt-get install -y php7.0-fpm php7.0-mysql;

    echo '#';
    echo '###################### Configuring nginx ######################'
    echo '#';
    sudo cat /vagrant/nginx.conf > /etc/nginx/sites-available/default;
    sudo service nginx start;

    echo '#';
    echo '###################### Installing php exts, php.ini ######################'
    echo '#';
    sudo service php7.0-fpm stop;
    sudo mv /etc/php/7.0/fpm/php.ini /etc/php/7.0/fpm/php.ini.default;
    sudo mv /etc/php/7.0/cli/php.ini /etc/php/7.0/cli/php.ini.default;
    sudo touch /etc/php/7.0/fpm/php.ini&& sudo chown vagrant:vagrant /etc/php/7.0/fpm/php.ini;
    sudo touch /etc/php/7.0/cli/php.ini && sudo chown vagrant:vagrant /etc/php/7.0/cli/php.ini;
    sudo apt-get install -y php-mbstring php-xml;
    sudo sed 's/;extension=php_mbstring.dll/extension=php_mbstring.dll/' </etc/php/7.0/fpm/php.ini.default >/etc/php/7.0/fpm/php.ini
    sudo sed 's/;extension=php_mbstring.dll/extension=php_mbstring.dll/' </etc/php/7.0/cli/php.ini.default >/etc/php/7.0/cli/php.ini
    sudo service php7.0-fpm start;

    echo '#';
    echo '###################### Installing composer ######################'
    echo '#';
    cd /var/www/invoicetrackr;
    sudo php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');";
    sudo php composer-setup.php --filename=composer;
    sudo mv composer /usr/bin;
    sudo unlink composer-setup.php;
    sudo chown -R www-data:www-data /var/www/invoicetrackr;


    echo '#';
    echo '###################### Installing node package manager ######################'
    echo '#';
    sudo apt-get install -y nodejs npm;
    sudo ln -s /usr/bin/nodejs /usr/bin/node;

    echo '#';
    echo '###################### Running composer & npm installs ######################'
    echo '#';
    sudo apt-get install -y unzip;
    sudo npm install webpack -g;
    sudo npm install --only=dev;
    sudo composer install;

    sudo chown -R www-data:www-data /var/www/invoicetrackr && sudo chmod -R 664 /var/www/invoicetrackr && sudo find /var/www/invoicetrackr -type d -exec chmod 775 {} \;

    echo '#';
    echo '###################### Installing xdebug ######################'
    echo '#';
    sudo apt-get install -y php7.0-dev;
    wget http://xdebug.org/files/xdebug-2.4.1.tgz;
    tar -xvzf xdebug-2.4.1.tgz;
    cd xdebug-2.4.1;
    sudo phpize;
    sudo ./configure;
    sudo make;
    sudo cp modules/xdebug.so /usr/lib/php/20151012;

    sudo echo "zend_extension = /usr/lib/php/20151012/xdebug.so" >> /etc/php/7.0/fpm/php.ini;
    sudo echo "xdebug.remote_enable = on" >> /etc/php/7.0/fpm/php.ini;
    sudo echo "xdebug.remote_connect_back = on" >> /etc/php/7.0/fpm/php.ini;
    sudo echo "xdebug.idekey = 'vagrant'" >> /etc/php/7.0/fpm/php.ini;

    sudo echo "zend_extension = /usr/lib/php/20151012/xdebug.so" >> /etc/php/7.0/cli/php.ini;
    sudo echo "xdebug.remote_enable = on" >> /etc/php/7.0/cli/php.ini;
    sudo echo "xdebug.remote_connect_back = on" >> /etc/php/7.0/cli/php.ini;
    sudo echo "xdebug.idekey = 'vagrant'" >> /etc/php/7.0/cli/php.ini;

    sudo rm -fr /var/www/invoicetrackr/xdebug-2.4.1*;

    sudo service vsftpd restart;
    sudo service mysql restart;
    sudo service php7.0-fpm restart;
    sudo service nginx restart;

    echo '#';
    echo '###################### customizing bash ######################'
    echo '#';
    sudo echo "alias ls='ls -lAh'" >> /home/vagrant/.bashrc;
    sudo echo "cd /var/www/invoicetrackr" >> /home/vagrant/.bashrc;
    sudo chown -R www-data:www-data /var/www/invoicetrackr && sudo chmod -R 664 /var/www/invoicetrackr && sudo find /var/www/invoicetrackr -type d -exec chmod 775 {} \;
    sudo gpasswd -a vagrant www-data;

    # @TODO Install Mysql, create database, import table
    # sudo apt-get install -y mysql-server-5.5 mysql-client;
    # sudo mysql_secure_installation;
    # import tables...
  EOL
end
