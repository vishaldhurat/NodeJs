Book App

==================
Steps For Configuration :

1. Download the mysql server : https://dev.mysql.com/downloads/installer/
2. Create the DB Connection with username : root and Password : root
3. Create the Db Scheama name : bookapp_db
4. Import  .sql file (bookapp_db.sql) available in this root folder for DDLs


Please find the apiDocs(endpoint docs) in the folder : bookapp-backend/apidoc/index.html

===================================================================================================

API Doc Generation Steps :

1. First Install the apiDoc plugin 
	sudo npm install apidoc -g

2. run the below command in your project root folder

 apidoc -i ../bookapp-backend/controllers/ -o apidoc/ 

3. Now you can see the apiDocs endpoints details in folder : bookapp-backend/apidoc/index.html