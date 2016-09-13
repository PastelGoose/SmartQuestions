#Getting Started

## Package installation.

You need to do **three** npm installs:

1. In terminal, in server folder, run:
  - npm install
2. In client/teacher folder, run:
  - npm install
3. In client/student folder, run:
  - npm install

## Setup the Database

1. Install MySQL on your machine. Run by typing in terminal: 
  - mysql.sever start
2. Change root password for sequelize in index.js in db folder to whatever your root password is. It is set to 'hi' currently. (If you didn't do a secure install of MySQL, your root password will just be the empty-string.) 
3. Go to db folder in terminal. Run:
  - mysql -u root -p < schema.sql
  - Enter root password when prompted.
  - This will create the database and tables.
4. For some dummy data: in db folder, run:
  - mysql -u root -p < script.sql
  - Enter root password when prompted.
  - This will insert some teachers, students, questions, and queue some questions in db.

## To Run Server

To run server with live update, in SmartQuestions folder, run:
  - nodemon server/server.js

Without live update, run:
  - node server/server.js

## To Run Live Compilation of Front End
In terminal, in client/teacher folder, run:
  - npm run dev

In terminal, in client/student folder, run:
  - npm run dev


#Links to helpful documents:

- [Flow charts for the algorithm that assigns competencies and the algorithm that determines which questions to serve.][1]
- [Database schemas and their relationships.][2]
- [List of endpoints and the data they serve/expect][3]
[1]:https://drive.google.com/file/d/0Bwr5hGM9k3SUYnhrbldaVWNnbFE/view?ts=57d7695e
[2]:https://drive.google.com/file/d/0Bwr5hGM9k3SUZGhDSUxRTy1DLWc/view?ts=57d76a4c
[3]:https://docs.google.com/spreadsheets/d/1aqNWiwDfv5kisZA-WFoUan4rOEKXZ4wA4Q9zD3HGH0s/edit#gid=0

#Wish List

##Big
- No explicit assignment of difficulty to questions; algorithm assigns a difficulty based on students' performance.
- Authentication
  - Goalt 1; enable multiple students.
  - Goal 2: enable multiple teachers.

The database is ready for this. At the moment both teacher and student user ids are hard-coded; you'll need to change that.

- Conglomeration of data from students in a class, metrics for the performance of a class as a whole.

- Fancier data visualisation.

##Small

- The react router should use *browserHistory*, rather than *hashHistory*. See [here][4], and the next lesson.
- Markdown functionality for entering questions. Maybe see the formatted question appear in another field as you type.

[4]: https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating
