# Demo of Updates
I made some updates to your Beauty.IO application
DEMO:
![https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/complete_demo.gif](https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/complete_demo.gif)

## Enabled Features
* `Login` and `Register` buttons are visible under ![https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/login_register.png](https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/login_register.png)
* Profile shows **NOT LOGGED IN!** or **User's Name** when logged in.
* `Upload` div only displayed for **logged-in users**
* MySQL `videos` table contains details for each uploaded video (filename, thumbnail, name, email, etc.)
* `video` div displays **thumbnail** and **uploader name** for each video 

# NOTES
* Files I made changes to include the comment `TEDDY EDIT`
* Moved the **GET** requests from `app.js` to `controllers/pages.js` and `routes/pages.js`, both referenced by `pagesController`
* Added a `videos` table to MySQL Database
* I did not do a complete "error handling" for most callback functions (for you to finish)
* I assumed that only **logged-in users** should be allowed to upload videos
* added a `.gitignore`
* added `public/thumbs` and `public/notes` directories

# SETUP
These are the steps I took to setup my environment and run your web server
1) Setup GitHub
2) Setup MySQL Database
3) Running The Web Server
4) Making Changes and Creating a Pull Request

## 1. GitHub
### Fork Repository
* Navigate to [https://github.com/wdharmon/seniordesign](https://github.com/wdharmon/seniordesign)
* Click the ![https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/fork.png](https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/fork.png) button to initiate a **Fork**

### Clone Repository
> change `kkatayama` with your github username
> in a shell, execute the following command
```bash
git clone https://github.com/kkatayama/seniordesign.git
```

## 2. MySQL Database
### Start MySQL Shell With Root

```bash
mysql -u root
```

### Create `beautyio` user

```mysql
mysql> CREATE USER 'beautyio'@'localhost' IDENTIFIED WITH mysql_native_password BY 'CODSNIPER26$';
Query OK, 0 rows affected (0.01 sec)
```

### Give `beautyio` user root access

```mysql
mysql> GRANT ALL PRIVILEGES ON * . * TO 'beautyio'@'localhost';
Query OK, 0 rows affected (0.01 sec)
```

### Reload Permissions

```mysql
mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.01 sec)
```

### Exit MySQL Shell and test **beautyio** user

```mysql
mysql> exit
Bye
```
```bash
mysql -u'beautyio' -p'CODSNIPER26$'
```

### Create Database `beautyio`
```mysql
mysql> CREATE DATABASE beautyio;
Query OK, 1 row affected (0.01 sec)
```

### Connect to the Database `beautyio`
```mysql
mysql> USE beautyio;
Database changed
```

### Create `users` Table
```mysql
mysql> CREATE TABLE users (name VARCHAR(64), email VARCHAR(255), password VARCHAR(255), create_time VARCHAR(32), id INT NOT NULL PRIMARY KEY AUTO_INCREMENT);
Query OK, 0 rows affected (0.05 sec)
```

### Create `videos` Table and exit
```mysql
mysql> CREATE TABLE videos (filename VARCHAR(255), thumbnail VARCHAR(255), name VARCHAR(64), email VARCHAR(255), userid INT, videoid INT NOT NULL PRIMARY KEY AUTO_INCREMENT);
```

```mysql
mysql> exit
Bye
```

## 3. Running the Web Server
Go back to you shell and navigate to the **seniordesign** directory you had `git clone` in *Step 1.*
### Navigate to `seniordesign` directory
```bash
cd seniordesign
```

### Install node packages missing from your system
```bash
npm install
```

### Run the Web Server
```bash
nodemon app.js
```

## 4. Making Changes and Creating a Pull Request
### Creating a Branch for making edits
If you plan on making edits, doing them in a branch isolates your changes and helps with migration
> In this case, I created a branch `teddy_test` to make my changes

```bash
git checkout -b teddy_test
```

### Add files, Commit changes, and Push the changes to your repo
> After making your changes, run these commands and add a description
```bash
git add -A && git commit -am 'updated the Readme' && git push origin teddy_test
```

### Creating the Pull Request
Navigate to your github forked repository and you will see a `Compare & pull request` button.
![https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/pull_request_notice.png](https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/pull_request_notice.png)

Click the ![https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/pull_request.png](https://raw.githubusercontent.com/kkatayama/seniordesign/teddy_test/public/notes/pull_request.png).
Enter a Description for the changes you made and submit the request :)

