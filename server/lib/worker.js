//goes to studentquestions table and looks for graded questions from today
//group by student by category
//score - 3 /3 + current competency
//eg 4 grade on a level 10 question
//diff level and self level. eg 7 - 6 / 3
//2/3 * 1
//math.max( 0, (grade -3) * math.max(1, (level - your level) )/ tune + current competency
//1-3 * 7-6// 0 if level is higher and score is lower than 3
//1-3 1-6 -5 -2 // -1 if level is lower and score is lower than 3

var db = require('../db');
var utils = require('./utils');
var _ = require('underscore');

var worker = function() {

	db.Student.findAll({
		// where: {
		// 	workerReviewed: false
		// }, 
		attributes: ['id'],
		include: [
		    {
		        model: db.Question,
		        through: {
		        	attributes: ['grade', 'QuestionId', 'gradedDate', 'StudentId'],
		        	where: {workerReviewed: false, isGraded: true}
		        },
		        attributes: ['CategoryId']
		    }
		],
		// group: ['id']
	})
	.then(function(result) {
		console.log('results!!!', result)
	})
}

worker();