var db = require('../db');

var teacherResponse = {
	data: [
		{
			questionId: 1,
			question: 'what\'s two plus two',
			category: 'recursion',
			difficulty: 10
		},
		{
			questionId: 2,
			question: 'what\'s one times seven',
			category: 'logic',
			difficulty: 10
		}
	]
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

var teacher = {
	submitProblems: function(req, res) {
		res.json(teacherResponse);
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
