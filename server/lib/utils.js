var db = require('../db');
var _ = require('underscore');

module.exports = {
	getInitialQuestions: function(studentId, res) {
		//find categories' latest competency
		db.IndividualCompetencies.findAll({
			where: {studentId: studentId}
		})
		.then(function(studentComps) {
//find the weakest
			var studentsSorted = [];

			var dani = _.sortby(studentComps, 'competencyScore');
			console.log(dani)


			// studentComps.forEach(function(studentComp){
			// 	if(studentsSorted.length === 0) {
			// 		studentsSorted.push(studentComp);
			// 	} else {
			// 		studentsSorted[0].competencyScore>
			// 	}
			// 	competencyScores.push(studentComp.competencyScore);
			// })
			// competencyScores.sort(function(a,b) {return})
		})

		//find questions that are not answered for student in the weakest categories
		//filter for questions with difficulty near their competency level OR check for confidence for the questions
		//return 5 question ids with difficulty level
		//give sorting score
		//return questions
		//change is isQueued fields

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

		//everyday, as student answers questions, the joint table gets new 
		//everyay, algo go into student questions and grabs questions answered for the day
		//algo calculate compentency for the categories affected
		//algo adds line to category table
		//algo updates the currentcompentency table

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



		//get newly graded qustions
		//see which category they below to
		//calculate new increase competency for taht category or decrease
		//add competency
		//if cinrease, set improving
		//
	}, 
	addQuestionsCategoriesToStudent: function(teacherId, studentId) {
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
				student.setCompetency(categoriesArray, {updatedAt: new Date()});

			})
			
		})
	},
	addCategoryToExistingStudent: function(teacherId, categoryId, isNew) {
		if (isNew) {
			db.Student.findAll({
				where: {teacherId: teacherId}
			})
			.then(function(students) {
				students.forEach(function(student){
					student.setCompetency(categoryId);
				})
			})
		}
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
	},
	findQuestions: function(studentId, categoryLimit, limitPerCategory, upperRange, lowerRange,res, callback) {
		var search = function(categoryLimit, limitPerCategory, upperRange, lowerRange, searchCycles) {

			db.IndividualCompetency.findAll({
				where: {studentId: studentId},
				order: [['competencyScore', 'ASC']],
				limit: categoryLimit
			})
			.then(function(studentComps) {
				// var competencySorted = _.sortBy(studentComps, 'competencyScore');
				console.log(studentComps, 'found')
				if(studentComps.length === 0) {
					callback(null);
					return;
					console.log('found none');

				}
				// res.send(studentComps)
				var questionsCount = 0;
				var finalresult = [];

				for(var i = 0; studentComps && i < studentComps.length; i++) {
					console.log('cat',studentComps[i].CategoryId);

					db.Student.findById(studentId, {
						include: [{
							model: db.Question, 

							where: {
							// limit: limitPerCategory,
								CategoryId: studentComps[i].CategoryId,
								difficulty: {
									$lt: studentComps[i].competencyScore + upperRange,
									$gt: studentComps[i].competencyScore - lowerRange
								},
							},
							required: true,
							through: {
		      					attributes: ['QuestionId', 'confidenceScore', 'isAnswered', 'orderInQueue', 'difficulty', 'CategoryId'],
				    			where: {isAnswered: false, isQueued: false},
							}, 

							include: [{
								// where: {categoryId: studentComps[i].CategoryId},
								model:db.Category
							}]
						}],
						order: [[db.Question, 'difficulty', 'ASC']],
						// limit: 2,

					})
					.then(function(result) {
						console.log('result', result);
						if (result) {
							finalresult.push(result.Questions);
							questionsCount += result.Questions.length;
						} else {
							finalresult.push([]);
						}
						if(finalresult.length === studentComps.length) {
						// res.send(finalresult)
						console.log('finalresult!!', questionsCount, searchCycles)
							if(questionsCount < 3 && searchCycles < 2) {
								console.log('==============in search cycle', finalresult.questionsCount, searchCycles)
								searchCycles++;
								search(categoryLimit * 2, limitPerCategory * 2, upperRange * 2, lowerRange, searchCycles);
							} else if (questionsCount < 3 && searchCycles < 3) {
								searchCycles++;
								search(categoryLimit * 2, limitPerCategory * 2, upperRange, lowerRange * 2, searchCycles);
							} else {
								console.log('count', questionsCount, finalresult);
								callback({questionsCount: questionsCount,
								questions: finalresult});
								
							}
						}
					})
				}
			})
		};

		search(categoryLimit, limitPerCategory, upperRange, lowerRange, 1);


	}


}
//exclude: ['baz']