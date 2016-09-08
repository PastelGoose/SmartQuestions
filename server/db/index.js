var Sequelize = require('sequelize');
var db = new Sequelize('smartquestions', 'root', 'hi', {define: {
        timestamps: false
    }});


var Teacher = db.define('Teacher', {
	firstname: Sequelize.STRING, 
	lastname: Sequelize.STRING,
	username: Sequelize.STRING,
	password: Sequelize.STRING,
});

var Student = db.define('Student', {
	firstname: Sequelize.STRING, 
	lastname: Sequelize.STRING,
	username: Sequelize.STRING,
	password: Sequelize.STRING,
});

var Question = db.define('Question', {
	questionText: Sequelize.STRING, 
	difficulty: Sequelize.INTEGER,
});

var Category = db.define('Category', {
	name: Sequelize.STRING, 
});

var StudentQuestion = db.define('StudentQuestion', {
	isViewed: Sequelize.BOOLEAN,
	isAnswered: Sequelize.BOOLEAN,
	answerDate: Sequelize.DATE,
	answer: Sequelize.STRING,
	confidenceScore: Sequelize.INTEGER,
	isQueued: Sequelize.BOOLEAN,
	orderInQueue: Sequelize.INTEGER,
	isGraded: Sequelize.BOOLEAN,
	grade: Sequelize.INTEGER
});

var StudentCategory = db.define('StudentCategory', {
	competencyScore: Sequelize.INTEGER,
	isImproving: Sequelize.BOOLEAN,
	createdAt: Sequelize.DATE
});

// var DailyQuestion = db.define('DailyQuestion', {

// 	order: Sequelize.INTEGER,
// 	isServed: Sequelize.BOOLEAN
// });

Question.belongsTo(Teacher);
Teacher.hasMany(Question);

Student.belongsTo(Teacher);
Teacher.hasMany(Student);

Question.belongsTo(Category);
Category.hasMany(Question);

// Question.belongsToMany(Student, {as: '', through: 'QueuedQuestion'})
// Student.belongsToMany(Question, {as: '', through: 'QueuedQuestion'})

Question.belongsToMany(Student, {through: 'StudentQuestion'})
Student.belongsToMany(Question, {through: 'StudentQuestion'})

Category.belongsToMany(Student, {through: 'StudentCategory'})
Student.belongsToMany(Category, {through: 'StudentCategory'})


Question.sync();
Teacher.sync();
Student.sync();
Category.sync();

StudentQuestion.sync();
StudentCategory.sync();

module.exports.Question = Question;
module.exports.Teacher = Teacher;
module.exports.Student = Student;
module.exports.Category = Category;
module.exports.StudentQuestion = StudentQuestion;
module.exports.StudentCategory = StudentCategory;

