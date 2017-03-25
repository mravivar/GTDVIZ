# GTDVIZ
CSE 578 Project 2017 Spring.
This project is for visualization of global terrorist database.

Source of the dataset http://www.start.umd.edu/gtd/contact/.


## Goal:
Milestone 1:

Milestone 2:

Milestone 3: Demo the project, Fully functioning system.

Milestone 4: Polished project


## Tools Used:

Back End   - MongoDB

Middleware - Node-js, Express-js

Front End  - D3, javascript, JQuery, HTML, CSS


## Exrenal Libraries Used:

Parallel Coordinates : https://syntagmatic.github.io/parallel-coordinates/

Scrollable Tables - https://github.com/ile/d3-tablesort

Slider for year selcet: https://refreshless.com/nouislider/


## Runing the Project
### Setting the DB:
1. install mongo db
2. create a folder for the db(probably inside the mongodb folder). E.g. C:\Program Files\MongoDB\db
3. To configure mongodb and run: 
    1. open command prompt in Admin mode
    2. Go to the bin folder of mongodb

    >mongod --directoryperdb --dbpath < path to the DB> --logpath < path to log file> --rest --install

    For Example, 

    >mongod --directoryperdb --dbpath "C:\Program Files\MongoDB\db" --logpath "C:\Program Files\MongoDB\server.log" --rest --install
    3.Run mongodb

    >net start MongoDB

    (Reference)https://www.youtube.com/watch?v=pWbMrx5rVBE&t=1619s
4. Creating DB and tables:

Open mongodb shell:

>mongo

create a DB named gtd:

>use gtd

create a collection called events:

>db.createCollection('events')

Exit the mongo shell:

>ctrl+c


5. To import the gtd records into the DB:

    1.Convert our data into csv file. open your gtd.xls file, save as csv.
    
    2.Go to mongodb bin:
    
    >mongoimport --db gtd --collection events --type csv --headerline --file < path to csv>
    E.g. 
    >mongoimport --db gtd --collection events --type csv --headerline --file "C:\Users\murlee417\Documents\GTD_0616dist\gtd.csv"

### Setting up the Middleware:
1. install node js
        1.  install npm 
        >npm install
2. Open command prompt. Go to <github_GTD_Project_HOME>. 
Run the commands:
>npm install express --save
>npm install mongodb --save

<!--
ignore the below commands
-------------------------
To configure the project:
>npm init 
set the starting point to index.html
-->

### Finally, Run:
1. I assume that you have already ran the MongoDB server or as a service.
2. Run the middleware. Goto the main folder where serverPoint.js is present:
>node serverPoint.js
3. Open the the below link in the browser to see the magic !
>http://localhost:3000






