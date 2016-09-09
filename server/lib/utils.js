var db = require('../db');
var _ = require('underscore');

module.exports = {
	//when the student selects a teacher, this function is called to add the appropriately categories to his/her table to keep track of progress. all students start with competency of 0
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
	//when teacher adds new questions, new categories(aka competencies) are added to all of his/her students
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
	//this function adds questions to the student. it is not used now bc it is combined with addQuestionsCategoriesToStudent
	// addCategoriesToStudent: function(teacherId, studentId) {
	// 	console.log('in addQuestionsToStudent')
	// 	db.Student.findById(studentId)
	// 	.then(function(student) {
	// 		db.Question.findAll({where: {TeacherId: teacherId}})
	// 		.then(function(questions) {
	// 			student.addQuestions(questions);
	// 		})
			
	// 	})
	// },

	//when the teacher submits a question, this function is called to add the question to the teacher
	addQuestionToExistingStudent: function(teacherId, questionId) {
		db.Student.findAll({where: {teacherId: teacherId}})
		.then(function(students) {
			students.forEach(function(student) {
				student.addQuestion(questionId);
			})
		})
	},
	calculateCompetency: function(studentObj, tuningCoefficient){
		var newCompetency = {
			studentId: studentObj.studentId,
			oldCompetencies: studentObj.competency,
			newCompetencies: {}
		};
		console.log('=================', studentObj)
		//check each category
		_.each(studentObj.categories, function(val, key) {
			var totalPoints = 0;
			//check each question of each category to see how many points the student gets
			console.log(val, key);
			var currCompetencyScore = studentObj.competency[key];
			_.each(val, function(tuple) {
				var grade = tuple[0];
				var difficulty = tuple[1];

				if (grade >= 3 && difficulty >= currCompetencyScore) {
					var point = (grade - 3) * (difficulty - currCompetencyScore) / tuningCoefficient;
				} else if (grade < 3 && difficulty < currCompetencyScore) {
					var point = -1 / tuningCoefficient;
				} else {
					var point = 0;
				}

				totalPoints += point;
				//math.max( 0, (grade -3) * math.max(1, (level - your level) )/ tune + current competency
				//1-3 * 7-6// 0 if level is higher and score is lower than 3
				//1-3 1-6 -5 -2 // -1 if level is lower and score is lower than 3

			})
			console.log('waah', totalPoints, currCompetencyScore)
			if (totalPoints) {
				newCompetency.newCompetencies[key] = totalPoints + currCompetencyScore;
			} else {
				newCompetency.newCompetencies[key] = 'no change';
			}
		})

		return newCompetency;
	},
	// this is the smart search function that looks for the lowest competencies of the student and find unanswered questions in these categories that have difficulty level around the student's level. this function expands search range three times if it doesn't find enough questions. 
	findQuestions: function(studentId, categoryLimit, minQuestionCount, upperRange, lowerRange,res, callback) {
		var search = function(categoryLimit, minQuestionCount, upperRange, lowerRange, searchCycles) {

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
								CategoryId: studentComps[i].CategoryId,
								difficulty: {
									$lt: studentComps[i].competencyScore + upperRange,
									$gt: studentComps[i].competencyScore - lowerRange
								},
							},
							required: true,
							through: {
		      					attributes: ['QuestionId', 'confidenceScore', 'isAnswered', 'orderInQueue', 'difficulty', 'CategoryId'],
				    			where: {isAnswered: false},
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
						if(finalresult.length === studentComps.length || questionsCount > 10) {
							if(questionsCount < minQuestionCount && searchCycles < 2) {
								console.log('==============in search cycle', finalresult.questionsCount, searchCycles)
								searchCycles++;
								search(categoryLimit * 2, minQuestionCount, upperRange + 1, lowerRange, searchCycles);
							} else if (questionsCount < minQuestionCount && searchCycles < 3) {
								searchCycles++;
								search(categoryLimit * 2, minQuestionCount, upperRange + 2, lowerRange * 2, searchCycles);
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

		search(categoryLimit, minQuestionCount, upperRange, lowerRange, 1);

	}


}
//exclude: ['baz']