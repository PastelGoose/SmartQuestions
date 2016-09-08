var db = require('../db');
var _ = require('underscore');

module.exports = {
	getInitialQuestions: function(studentId, res) {
		//find categories' latest competency
		db.StudentCategory.findAll({
			where: {
				categoryId:{$in: [1,2]},
				StudentId:7
			},
			order: [['createdAt', 'DESC']],
			limit: 1
		})
		.then(function(result) {
			console.log(result);
			res.send(result);
		})
			// db.Category.findAll({
			// 	include: [{
			// 		model: db.Student, 
			// 		through: {
			// 			attributes: ['createdAt'],
			// 			order: [['createdAt', 'ASC']]
			// 		}, 
			// 	}]
			// })
			// .then(function(result) {
			// 	console.log(result);
			// 	res.send(result);
			// })
		// db.Student.findById(studentId)
		// .then(function(student) {
		// 	student.getCategories()
		// 	.then(function(categories) {
		// 		console.log('categories', categories);
		// 		// res.send(categories);
		// 		categories.forEach(function(category) {
		// 			console.log('i am here!')
		// 			db.StudentCategory.findOne({
		// 				order: [[student, category, 'createdAt', 'DESC']]
		// 			})
		// 			// .then(function(found) {
		// 			// 	console.log('----found', found);
		// 			// })
					
		// 		})
		// 	})
		// })
//'"createdAt" ASC'
//{limit:4, order: [db.Category, 'createdAt', 'DESC'] }
// [] [User, Company, 'name', 'DESC']
		//{ limit: 10, order: '"updatedAt" DESC' }
		//find weakest categories

		//find questions that are not answered for student in the weakest categories
		//filter for questions with difficulty near their competency level OR check for confidence for the questions
		//return 5 question ids with difficulty level
		//give sorting score
		//return questions
		//change is isQueued fields

		//get newly graded qustions
		//see which category they below to
		//calculate new increase competency for taht category or decrease
		//add competency
		//if cinrease, set improving
		//
	}, 
	addQuestionsToStudent: function(teacherId, studentId) {
		console.log('in addQuestionsToStudent')
		db.Student.findById(studentId)
		.then(function(student) {
			db.Question.findAll({where: {TeacherId: teacherId}})
			.then(function(questions) {
				student.addQuestions(questions);
				var myCategories = {};
				questions.forEach(function(question) {
					myCategories[question.CategoryId] = question.CategoryId;
				})
				var categoriesArray = _.map(myCategories, function(myCategory) {
					return myCategory;
				})
				console.log('myCategories', categoriesArray);
				student.addCategories(categoriesArray);

			})
			
		})
	},
	addCategoriesToStudent: function(teacherId, studentId) {
		console.log('in addQuestionsToStudent')
		db.Student.findById(studentId)
		.then(function(student) {
			db.Question.findAll({where: {TeacherId: teacherId}})
			.then(function(questions) {
				student.addQuestions(questions);
			})
			
		})
	},
	addQuestionToExistingStudent: function(teacherId, questionId) {
		db.Student.findAll({where: {teacherId: teacherId}})
		.then(function(students) {
			students.forEach(function(student) {
				student.addQuestion(questionId);
			})
		})
	}

}
//exclude: ['baz']