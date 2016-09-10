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
		attributes: [['id', 'studentId']],
		include: [
		    {
		        model: db.Question,
		        required: true,
		        through: {
		        	attributes: ['id', 'grade', 'QuestionId', 'gradedDate', 'StudentId', 'workerReviewed', 'isGraded'],
		        	where: {workerReviewed: false, isGraded: true}
		        },
		        attributes: ['CategoryId', 'difficulty'],
		        group: ['CategoryId']
		    }, 
		    {
		    	model: db.Category,
		    	as: 'Competency',
		    	through: {
		    		attributes: ['competencyScore']
		    	}
		    }
		]
	})
	.then(function(result) {

		var currCompetencyTable = [];
		result.forEach(function(student) {

			var currStudent = {
				studentId: student.get({plain:true}).studentId,
				categories: {},
				competency: {}
			}
			student.Questions.forEach(function(question) {
				var bundle = currStudent.categories[question.CategoryId] || [];
				bundle.push([question.StudentQuestion.grade, question.difficulty])
				if (bundle.length === 1) {
					currStudent.categories[question.CategoryId] = bundle;
				}
			})
			student.Competency.forEach(function(competency) {
				if(!currStudent.competency[competency.id]) {
					currStudent.competency[competency.id] = competency.IndividualCompetency.competencyScore;
				}
			})
			currCompetencyTable.push(currStudent);
		})

		var newCompetencyTable = [];
		currCompetencyTable.forEach(function(eachStudentObj) {
			//inputs are the student's object with has it's grades and current competency scores and a tuning variable. larger the turning variable, the harder it is to improve
			var newCompetency = utils.calculateCompetency(eachStudentObj, 3)
			newCompetencyTable.push(newCompetency);
			
		})


		//update db marking these questions as workerReviewed
		console.log('---------------', result)
		result.forEach(function(studentObj) {
			studentObj.Questions.forEach(function(question) {
				console.log('ahahahahahah', question.StudentQuestion)
				question.StudentQuestion.updateAttributes({workerReviewed: true})
				.then(function(updated) {
					console.log('yayy', updated);
				})
			})
		})

		//update IndividualCompetency Table
		//for each student
		//for each newcompetencies that not no change
		//look for individualCompetency where grab studernid and newcompetencyid
		//updateattributes

		newCompetencyTable.forEach(function(student) {
			_.each(student.newCompetencies, function(val, key) {
				if(val !== 'no change') {
					var isImproving = val > student.oldCompetencies[key] ? 1 : 0;
					console.log('isImproving', isImproving)
					db.IndividualCompetency.findOne( {
						where: {
							StudentId: student.studentId,
							CategoryId: key * 1
						}
					})
					.then(function(studentComp) {
						studentComp.updateAttributes({
							competencyScore: val,
							isImproving: isImproving
						})
						.then(function(result) {
							console.log('==============', result);
						})
					})
				}
			})
		})
	})
}

worker();