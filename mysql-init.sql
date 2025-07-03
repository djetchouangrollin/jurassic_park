CREATE DATABASE IF NOT EXISTS jurassic_park;
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT ALL PRIVILEGES ON jurassic_park.* TO 'root'@'%';
FLUSH PRIVILEGES;
