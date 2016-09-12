var db = require('../db');
var utils = require('./utils');
var _ = require('underscore');

//the worker updates the students' competencies by category 
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
		result.forEach(function(studentObj) {
			studentObj.Questions.forEach(function(question) {
				question.StudentQuestion.updateAttributes({workerReviewed: true})
				.then(function(updated) {
					console.log('updated!', updated);
				})
			})
		})

		//update db with new competency scores
		newCompetencyTable.forEach(function(student) {
			_.each(student.newCompetencies, function(val, key) {
				// if(val !== 'no change') {
					var isImproving = val > student.oldCompetencies[key] ? 1 : 0;
					db.IndividualCompetency.findOne( {
						where: {
							StudentId: student.studentId,
							CategoryId: key * 1
						}
					})
					.then(function(studentComp) {
						studentComp.updateAttributes({
							competencyScore: val,
							isImproving: isImproving,
							updatedAt: new Date()
						})
						.then(function(result) {
							console.log('result:', result);
						})
					})
					db.StudentCategory.upsert({
						CategoryId: key,
						StudentId: student.studentId,
						competencyScore: val,
						isImproving: isImproving,
						updatedAt: new Date()
					})
					// db.Student.findById(student.studentId)
					// .then(function(student) {
					// 	student.addCategories(key, {competencyScore: val, isImproving: isImproving, createdAt: new Date()})
					// })
				// }
			})
		})
	})
}

worker();