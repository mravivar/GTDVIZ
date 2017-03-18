# GTDVIZ
CSE 578 Project 2017 Spring.
This project is for visualization of global terrorist database

Tools Used:
-----------
Back End   - Database - MongoDB
Middleware - Node js, Express js
Front End  - HTML, javascript,D3

Setting the DB:
---------------
1. install mongo db
2. create a folder for the db(probably inside the mongodb folder). E.g. C:\Program Files\MongoDB\db
3. To configure mongodb and run: 
(i) open command prompt in Admin mode
(ii) Go to the bin folder of mongodb
>mongod --directoryperdb --dbpath <path to the DB> --logpath <path to log file> --rest --install
E.g. mongod --directoryperdb --dbpath "C:\Program Files\MongoDB\db" --logpath "C:\Program Files\MongoDB\server.log" --rest --install
(iii) Run mongodb
>net start MongoDB
(Reference)https://www.youtube.com/watch?v=pWbMrx5rVBE&t=1619s

4. Open mongodb shell:
>mongo
create a DB named gtd:
>use gtd
create a collection called events:
>db.createCollection('events')
Exit the mongo shell:
>ctrl+c

5. To import the gtd records into the DB:
(i)Convert our data into csv file. open your gtd.xls file, save as csv.
(ii)Go to mongodb bin:
>mongoimport --db gtd --collection events --type csv --headerline --file <path to csv>
E.g. mongoimport --db gtd --collection events --type csv --headerline --file "C:\Users\murlee417\Documents\GTD_0616dist\gtd.csv"

Setting up the Middleware:
--------------------------
1. install node js
1.a.  install npm 
>npm install
2. Open command prompt. Go to <github_GTD_Project_HOME>. Run the commands:
>npm install express --save
>npm install mongodb --save

<!--
ignore the below commands
-------------------------
To configure the project:
>npm init 
set the starting point to index.html
-->

How to Run:
-----------
1. I assume that you have already ran the MongoDB server or as a service.
2. Run the middleware. Goto the main folder where serverPoint.js is present:
>node serverPoint.js
3. Open the module in the browser with the below link
http://localhost:3000






