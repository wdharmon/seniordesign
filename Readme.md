# Prequisites
## GitHub
> Fork Repository
1) Navigate to [https://github.com/wdharmon/seniordesign](https://github.com/wdharmon/seniordesign)
2) Click the ![https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/fork.png](https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/fork.png) button to initiate a **Fork**

Clone Repository

```bash
git clone https://github.com/kkatayama/seniordesign.git
```

## MySQL Database
> Start MySQL Shell With Root

```bash
mysql -u root
```

> Create `beautyio` user

```mysql
mysql> CREATE USER 'beautyio'@'localhost' IDENTIFIED WITH mysql_native_password BY 'CODSNIPER26$';
Query OK, 0 rows affected (0.01 sec)
```

> Give `beautyio` user root access

```mysql
mysql> GRANT ALL PRIVILEGES ON * . * TO 'beautyio'@'localhost';
Query OK, 0 rows affected (0.01 sec)
```

> Reload Permissions

```mysql
mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.01 sec)
```

> Exit MySQL Shell and test **beautyio** user

```mysql
mysql> exit
Bye
```
```bash
mysql -u'beautyio' -p'CODSNIPER26$'
```

> Create Database `beautyio`
```mysql
mysql> CREATE DATABASE beautyio;
Query OK, 1 row affected (0.01 sec)
```

> Connect to the Database `beautyio`
```mysql
mysql> USE beautyio;
Database changed
```

> Create `users` Table
```mysql
mysql> CREATE TABLE users (name VARCHAR(64), email VARCHAR(255), password VARCHAR(255), create_time VARCHAR(32), id INT NOT NULL PRIMARY KEY AUTO_INCREMENT);
Query OK, 0 rows affected (0.05 sec)
```

> Create `videos` Table and exit
```mysql
mysql> CREATE TABLE videos (filename VARCHAR(255), thumbnail VARCHAR(255), name VARCHAR(64), email VARCHAR(255), userid INT, videoid INT NOT NULL PRIMARY KEY AUTO_INCREMENT);
```

```mysql
mysql> exit
Bye
```
