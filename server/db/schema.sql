create database smartquestions;

use smartquestions;

create table Teachers (
id int NOT NULL AUTO_INCREMENT,
firstname varchar(30),
lastname varchar(30),
username varchar(512) NOT NULL,
password varchar(30) NOT NULL,
PRIMARY KEY (ID)
);

create table Questions (
id int NOT NULL AUTO_INCREMENT,
question varchar(300),
difficulty int NOT NULL,
teacherId int,
categoryId int,
PRIMARY KEY (ID)
);

create table Categories (
id int NOT NULL AUTO_INCREMENT,
name varchar(100) NOT NULL,
PRIMARY KEY (ID)
);

create table Students (
id int NOT NULL AUTO_INCREMENT,
firstname varchar(30),
lastname varchar(30),
username varchar(512) NOT NULL,
password varchar(30) NOT NULL,
teacherId int,
PRIMARY KEY (ID)
);

create table StudentQuestions (
id int NOT NULL AUTO_INCREMENT,
studentId int,
questionId int,
orderInQueue int,
answer varchar(1000),
isViewed boolean NOT NULL DEFAULT 0,
isAnswered boolean NOT NULL DEFAULT 0,
confidenceScore int,
isQueued boolean NOT NULL DEFAULT 0,
PRIMARY KEY (ID)
);

create table StudentCategories (
id int NOT NULL AUTO_INCREMENT,
studentId varchar(30) NOT NULL,
categoryId varchar(30) NOT NULL,
createdAt datetime NOT NULL DEFAULT NOW(),
competencyScore int,
isImproving boolean,
PRIMARY KEY (ID)
);

