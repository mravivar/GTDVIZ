# GTDVIZ
CSE 578 Project 2017 Spring.
This project is for visualization of global terrorist database.

Actual Source Reference of the dataset http://www.start.umd.edu/gtd/contact/.
(We have attached the dataset wih the submision no need to download it from there)

Recommened System windows 10.

## Tools Used:

Back End   - MongoDB

Middleware - Node-js, Express-js

Front End  - D3, javascript, JQuery, HTML, CSS

## Runing the Project
### Setting the DB:
1. install mongo db
2. create a folder for the db(probably inside the mongodb folder). E.g. C:\Program Files\MongoDB\db
3. To configure mongodb and run: 
    1. open command prompt in Admin mode
    2. Go to the bin folder of mongodb
    >mongod --directoryperdb --dbpath "C:\Program Files\MongoDB\db" --logpath "C:\Program Files\MongoDB\server.log" --rest --install
    
    3.Run mongo deamon

    >mongod --directoryperdb --dbpath "C:\Program Files\MongoDB\db"

    (Reference)https://www.youtube.com/watch?v=pWbMrx5rVBE&t=1619s
4. Creating DB and tables:

Open mongodb shell(when bing in the bin folder of the mongodb installation):

>mongo

create a DB named gtd:

>use gtd

create a collection called events:

>db.createCollection('events')
>db.createCollection('agg_events')
Exit the mongo shell:

>ctrl+c


5. To import the gtd records into the DB:

    1.All the required data csv file can we found under dvBasic/data.
    
    2.Go to mongodb bin:
		Please get the data from the google drive, ASU email ID is need to access it.
		https://drive.google.com/drive/folders/0B04wQPuyw3FDekZSM3hpd2wzQWs?usp=sharing
    
    >mongoimport --db gtd --collection events --type csv --headerline --file < path to dataset_dv/gtd.csv>
    >mongoimport --db gtd --collection agg_events --type csv --headerline --file < path to dataset_dv/countries.csv>
    
    E.g. 
    
    >mongoimport --db gtd --collection events --type csv --headerline --file "C:\Users\murlee417\Documents\dataset_dv\gtd.csv"
    >mongoimport --db gtd --collection agg_events --type csv --headerline --file "C:\Users\Aravind\Documents\dataset_dv\countries.csv"

### Setting up the Middleware:
1. install node js and npm
        >npm install
2. Open command prompt. Go to <github_GTD_Project_HOME> which is dvBasic/. 
Run the commands:
>npm install


### Finally, Run:
1. I assume that you have already ran the MongoDB server or as a service.
2. To run the middleware. Goto the main folder(dvBasic/) where serverPoint.js is present:
>node serverPoint.js
3. Open the the below link in the browser to see the magic !
>http://localhost:3000






