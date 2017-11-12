# Project Manager

The following have been completed:
 - Mongo Schema for all the databases. This can be found in the folder /models
 - All the required server-side RESTful routes can be in the folder /routes. Client-side routes are defined in /React/project-manager/src/index.js
 - Cookie-Session management is implement
 - Currently, only passport-local strategy is implemented for authentication purpose
 - Users can now 
 	- login
 	- view all the teams they are part of
 	- select a team
 	- view all the tasks, tickets, wikis and all the users of that team
 	- create new task
 	- view individual task
 	- view individual ticket
 	- view individual wiki
 	- view individual user 

 ### Installing Node Modules

To install Node.js dependencies
```
cd ./projectManager
npm install
```

To install React.js dependencies
```
cd ./projectManager/React/project-manager
npm install
```

 ### Starting Node.js

 To start Node, type `npm start`

 ### Starting React.js

 To start Node, type `npm start`

 The web application will be available on http://localhost:8080

 For testing purpose, use the following credentials:

 ```
 username: user
 password: user
 ```