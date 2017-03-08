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
install mongo db
create a folder for the db(probably inside the mongodb folder)

Configure mongodb and run:
open command prompt in Admin mode
Go to the bin folder of mongodb
>mongod --dirctoryperdb --dbpath <path to the DB> --logpath <path to log file> --rest --install
Run mongodb
>net start MongoDB
https://www.youtube.com/watch?v=pWbMrx5rVBE&t=1619s
Open mongodb shell
>mongo
create a DB named gtd
>use gtd
create a collection called events
>db.createCollection('events')

Exit the shell
importing the gtd records into the DB:
Convert our data into csv file
Go to mongodb bin

>mongoimport --db gtd --collection events --type csv --headerline --file <path to csv>

Setting up the Middleware:
--------------------------
install node js
>npm install express
>npm install mongodb
To configure the project
>npm init 
set the starting point to index.html


How to Run:
-----------
I assume that you have already ran the MongoDB server or as a service.
Run the middleware
Goto the main folder where serverPoint.js is present.
>node serverPoint.js

Open the module in the browser with the below link
http://localhost:3000






