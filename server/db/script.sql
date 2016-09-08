use smartquestions;

insert into Teachers (firstname, lastname, username, password) values ('stephen', 'notwong', 'pokemonmaster', 'hackreactor');

insert into Teachers (firstname, lastname, username, password) values ('damien', 'mccool', 'mrteacher', 'hackreactor');

insert into students (firstname, lastname, username, password, teacherId) values ('stephen', 'notwong', 'pokemonmaster', 'hackreactor', 2);

insert into students (firstname, lastname, username, password, teacherId) values ('damien', 'mccool', 'mrteacher', 'hackreactor', 1);

insert into questions (question, difficulty, teacherId, categoryId) values ('why do cats cross the street', '10', 1, 1);
insert into questions (question, difficulty, teacherId, categoryId) values ('why do mice cross the street', '1', 1, 0);

insert into studentquestions (studentId, questionId, isViewed, isAnswered, isQueued) values (2,3,0,0,1);
insert into studentquestions (studentId, questionId, isViewed, isAnswered, isQueued) values (2,1,0,0,1);
insert into studentquestions (studentId, questionId, isViewed, isAnswered, isQueued) values (2,2,0,0,1);

insert into studentcategories (studentId, categoryId, createdAt, competencyScore, isImproving) values (2,2,now(), 1,0);
insert into studentcategories (studentId, categoryId, createdAt, competencyScore, isImproving) values (2,1,now(), 4,1);


