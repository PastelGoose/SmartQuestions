var db = require('../db');

var teacherResponse = {
	data: {
		questionId: 1,
		question: 'what\'s two plus two',
		category: 'recursion',
		difficulty: 10
	}
};

var allQuestions = {
	data: [
		{
			questionId: 1,
			question: 'what\'s one times seven',
			categories: 'recursion',
			difficulty: 10,
			answered: false,
			order: 1
		},
		{
			questionId: 2,
			question: 'what\'s one times seven',
			categories: 'logic',
			difficulty: 10,
			answered: false,
			order: 2
		}
	]
};

var teachersumit = {
uid: 1,
questions: [
{ question: 'what is the x kdjfd',
categories: 'recursion',
difficulty: 10
},
{ question: 'y times kdjfd',
categories: 'logic',
difficulty: 1
}
]
}

var teacher = {
	submitProblems: function(req, res) {
		var submission = req.body;

		db.Teacher.findOne({where: {id: submission.uid}})
		.then(function(teacher) {

			var resultProblems = [];
			submission.questions.forEach(function(question) {

				db.Question.findOrCreate({where: {question: question.question, difficulty: question.difficulty}})
				.spread(function(questionObj, createdQuestion) {

					db.Category.findOrCreate({where: {name: question.categories}})
					.spread(function(category, createdCategory) {

						questionObj.setTeacher(teacher)
						.then(function(questionSetTeacher) {

							questionSetTeacher.setCategory(category)
							.then(function(questionSetCategory) {

								resultProblems.push(questionSetCategory.get({plain: true}));
								if (resultProblems.length === submission.questions.length) {
									res.json(resultProblems);
								}
							})
						})
					})
				})
			})
		})
	}
};


var student = {
	respondOne: function(req, res) {
		res.sendStatus(201);
	},
	retrieveQuestions: function(req, res) {
		res.send(allQuestions);
	}
}; 


module.exports.teacher = teacher;
module.exports.student = student;
