var db = require('../db');
var utils = require('./utils');
var _ = require('underscore');

var mystring= {"uid":1,"questions":[{"questionText":"what is the x kdjf","category":"recursion","difficulty":10},{"questionText":"y times kdjf","category":"logic","difficulty":1}]}

var teacher = {
	getStudents: function(req, res) {
		var uid = req.query.uid || 1;
		db.Student.findAll({
			where: {teacherId: uid}
		})
		.then(function(students) {
			var result = [];
			students.forEach(function(student) {
				var currStudent = {
					studentId: student.id,
					studentName: student.firstname + ' ' + student.lastname
				}
				result.push(currStudent);
			})
			res.json({data: result})
		})
	},
	//this is called when the teach submits new questions. Note it can handle one question or multiple questions with each POST
	submitQuestions: function(req, res) {
		var submission = req.body;

		db.Teacher.findOne({where: {id: submission.uid}})
		.then(function(teacher) {

			var resultQuestions = [];
			submission.questions.forEach(function(question) {
				db.Question.findOrCreate({where: {questionText: question.questionText, difficulty: question.difficulty}})
				.spread(function(questionObj, createdQuestion) {
					console.log('my question id!!', questionObj.id)
					utils.addQuestionToExistingStudent(submission.uid, questionObj.id);
					return questionObj.setTeacher(teacher);
				})
				.then(function(questionSetTeacher) {					
					return db.Category.findOrCreate({where: {name: question.category}})
					.spread(function(category, createdCategory) {
						utils.addCategoryToExistingStudent(submission.uid, category.id, createdCategory);
						return questionSetTeacher.setCategory(category);
					})
				})
				.then(function(questionSetCategory) {
					resultQuestions.push(questionSetCategory.get({plain: true}));
					if (resultQuestions.length === submission.questions.length) {
						res.json({data: resultQuestions});
					}
				})
			})
		})
	},
	//this is called when the teacher wants to see all of his/her questions that are posted already
	retrieveAllQuestions: function(req, res) {
	var uid = req.query.uid || 1;

		db.Question.findAll({
			where: {teacherId: uid},
			include: [{model:db.Category}]
		})
		.then(function(allQuestions) {
			console.log(allQuestions)

			res.json({data: allQuestions});
		})
	},
	//this is called when the teacher wants to see a list of questions that he/she still needs to grade
	getUngradedQuestions: function(req, res) {
		var uid = req.query.uid || 1;

		db.Question.findAll({
			where: {TeacherId: uid}
		})
		.then(function(allQuestions) {
			var ids = [];
			allQuestions.forEach(function(question) {
				ids.push(question.id);
			})

			if (ids.length === 0 ) {
				console.log('id length is 0')
				return res.json({data: []})
			}

			db.Question.findAll({
				where: {id: 
					{$in: [ids]}
				}, 
				include: [{
					model: db.Student, 
					through: {
						attributes: ['answer', 'question'],
		    			where: {isAnswered: true, isGraded: false}
					}, 
				}, { model: db.Category, as: 'Category' } ]
			})
			.then(function(questionsResult) {
				var allResults = [];
				questionsResult.forEach(function(questionResult) {
					if(questionResult.Students && questionResult.Students.length !== 0 && questionResult.Category) {
						console.log('questionresult', questionResult)
						var result = {
							questionText: questionResult.questionText,
							difficulty: questionResult.difficulty,
							category: questionResult.Category.name,
							questionId: questionResult.id,
						}
						questionResult.Students.forEach(function(student) {
							result.studentId = student.id, 
							result.answer = student.StudentQuestion.answer
							allResults.push(result);
						})
					}
				})
				res.json({data: allResults});
			})
		})
	},
	//this is called when the teacher post grades for each question
	postGrades: function(req, res) {
		var teacherId = req.body.teacherId;
		var studentId = req.body.studentId;
		var grade = req.body.grade;
		var questionId = req.body.questionId;
		console.log('request body in postGrades', req.body)
		db.StudentQuestion.findOne({where: {StudentId: studentId, QuestionId: questionId}})
		.then(function(foundQuestion) {
			foundQuestion.updateAttributes({isGraded: 1, grade: grade, gradedDate: new Date()});
			res.send(foundQuestion);
		})
	},
	//this is called when the teacher asks for a report card of his/her class
	getReport: function(req, res) {
		var uid = req.query.uid || 1;

		db.Student.findAll({
			where: {TeacherId: uid}
		})
		.then(function(allStudents) {
			var ids = [];
			allStudents.forEach(function(student) {
				ids.push(student.id);
			})

			if (ids.length === 0 ) {
				console.log('id length is 0')
				return res.json({data: []})
			}

			db.Student.findAll({
				where: {id: 
					{$in: [ids]}
				}, 
				include: [{
					model: db.Question, 
					// required: true,
					through: {
						attributes: ['answer', 'question', 'grade', 'answerDate'],
		    			where: {isAnswered: true, isGraded: true}
					}, 
					include: [db.Category]
				},
				{
					model: db.Category,
					as: 'Competency',
					through: {
						attributes: ['competencyScore', 'isImproving', 'createdAt']
					}
				}]
			})
			.then(function(results) {
				var allResults = [];
				console.log('results found!', results)
				// res.json(results)

				results.forEach(function(studentResult) {
					// if(studentResult.Questions && studentResult.Questions.length !== 0 && studentResult.Categories) {
						console.log('questionresult', studentResult)
						var studentReport = {
							studentId: studentResult.id,
							name: studentResult.firstname + ' ' + studentResult.lastname,
							questionsAnswered: [],
							competency: []
						}

						studentResult.Questions.forEach(function(question) {
							var currQuestion = {
								questionId: question.id, 
								questionText: question.questionText,
								difficulty: question.difficulty,
								categoryId: question.categoryId,
								categoryName: question.Category.name,
								answer: question.StudentQuestion.answer,
								grade: question.StudentQuestion.grade,
								answerDate: question.StudentQuestion.answerDate
							};
							studentReport.questionsAnswered.push(currQuestion);
						})

						studentResult.Competency.forEach(function(category) {
							var currCategory = {
								categoryId: category.id,
								categoryName: category.name,
								competencyScore: category.IndividualCompetency.competencyScore,
								isImproving: category.IndividualCompetency.isImproving
							}
							studentReport.competency.push(currCategory);
						})

						console.log('after scrubbing', studentReport);
						allResults.push(studentReport);
						console.log('final report', allResults);

						if (allResults.length === results.length) {
							res.json({data:allResults});
						}
					// }
				})
				// res.json({data: allResults});
			})
		})
	}
};



var student = {
	test2: function(req, res) {
		db.Student.findAll({
			include: [
				{
					model: db.Category,
					as: 'Competency'
				}
			]
		})
		.then(function(result) {
			console.log('result', result);
			res.send(result)
		})
	
		db.Student.findAll({
			as: 'currstudent',
			attributes: [['id', 'studentId']],
			include: [
			    {
			    	model: db.Category,
			    	// attributes: ['id'],
			    	// group: ['id'],
			    	include: {
				    	model: db.Question,
				    	attributes: ['difficulty'],
				    	where: {id : student.studentId},
				        // required: true,
				        include: {
				        	model: db.Student,
					        through: {
					        	attributes: ['grade', 'QuestionId', 'gradedDate', 'StudentId', 'workerReviewed', 'isGraded'],
					        	where: {workerReviewed: false, isGraded: true}

					        },
				        },
				        group: ['CategoryId']
			    		
			    	}
			    }
			],
			// group: ['studentId']
		})
		.then(function(result) {
			// result.updateAttributes({workerReviewed: true})
			//by student by categoryid
			console.log('results!!!', result)
			var master = {
				StudentId: 2,
				categoryId: 4,
			}
			result.studentId
			res.send(result)
		})

	},
	test: function(req, res) {
		//student category
		//student questions

		db.Student.findAll({
				// where: {
				// 	workerReviewed: false
				// }, 
				attributes: [['id', 'studentId']],
				include: [
				    {
				        model: db.Question,
				        required: true,
				        through: {
				        	attributes: ['grade', 'QuestionId', 'gradedDate', 'StudentId', 'workerReviewed', 'isGraded'],
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
				],
				// group: ['studentId']
			})
			.then(function(result) {
				// result.updateAttributes({workerReviewed: true})
				//by student by categoryid
				// res.send(result)
				var currCompetencyTable = [];
				result.forEach(function(student) {
					console.log('==============',student.get({plain:true}).studentId)
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

				console.log('results!!!', result)
				var newCompetencyTable = [];
				currCompetencyTable.forEach(function(eachStudentObj) {
					//inputs are the student's object with has it's grades and current competency scores and a tuning variable. larger the turning variable, the harder it is to improve
					var newCompetency = utils.calculateCompetency(eachStudentObj, 3)
					newCompetencyTable.push(newCompetency);
					
				})

				//
					res.send(newCompetencyTable);
			})
	},
	retrieveSmartQuestions: function(req, res) {
		studentId = req.query.uid || 2;

		utils.findQuestions(studentId, 2, 3, 3, 2, res,function(result) {
			console.log('myresult', result)
			// if(result.questionsCount < 1) {
			// 	utils.findQuestions(studentId, 6, 1, 4,0, function(result) {
			// 		res.send(result);
			// 	})
			// // } else if (result.questionsCount < 10) {
			// // 	res.send(result.questions);
			// } else {
				if(!result) {
					res.send({data: []})
				}
				var orderCounter = 0;
				var response = [];
				var sortedResult = _.sortBy(result.questions, 'length')
				// res.send(dani)
				for (var i = 0; i < Math.min(sortedResult[sortedResult.length - 1].length, 5); i++){
					if(orderCounter > 10) { break; }
					sortedResult.forEach(function(question){
						if (question[i]) {
							console.log('inside', question[i])
							var currQuestion = {
								questionId: question[i].id,
								difficulty: question[i].difficulty,
								questionText: question[i].questionText,
								categoryId: question[i].CategoryId,
								order: ++orderCounter,
								answered: false,
								category: question[i].Category.name
							}
						console.log('wah================', currQuestion)
						response.push(currQuestion);
						}
					})
				}
				console.log('finals')
				res.send({data: response});
			// }
		})
	},
	//this is called when the student respond to one question. It logs the response in DB
	respondOne: function(req, res) {
		var uid = req.query.uid || 2;
		var response = req.body;
		console.log('i am in responseone')
		db.StudentQuestion.findOne({where: {StudentId: response.uid, QuestionId: response.questionId}})
		.then(function(foundQuestion) {
			foundQuestion.updateAttributes({isAnswered: 1, answer: response.answer, answerDate: new Date()});
			res.send(foundQuestion);
		})

	},
	//this is called when the client asks for all questions for the student for the day. these are the question that are marked isQueued
	retrieveQueuedQuestions: function(req, res) {
		var uid = req.query.uid || 2;

		db.Student.findById(uid, {
		  include: [{
		    model: db.Question,
		    through: {
      			attributes: ['QuestionId', 'confidenceScore', 'isAnswered', 'orderInQueue', 'difficulty', 'CategoryId'],
		    	where: {isQueued: true}
		    }
		  }, db.Teacher]
		})
		.then(function(result) {
			if (result.TeacherId === null) {
			// console.log('result!!',result)
				return res.send('No teacher found');
				// console.log('after return')
			}
			console.log('result', result)
			var result = result.get({plain: true});

			if (result.Questions.length !== 0) {
				var questionArray = [];

				result.Questions.forEach(function(question) {
					db.Category.findById(question.CategoryId)
					.then(function(category) {
						var currQuestion = {
							questionId: question.id,
							questionText: question.questionText,
							answered: question.StudentQuestion.isAnswered,
							order: question.StudentQuestion.orderInQueue,
							difficulty: question.difficulty,
							category: category.name
						}
						questionArray.push(currQuestion);
						if(questionArray.length === result.Questions.length) {
							res.json({data: questionArray});
						}
						
					})
				})
			} else {
				// console.log('did not find questions')
				res.json({data: []});
			}
		})
	},
	//this is called after the student signsup and asks to see a list of teachers/classes to enroll
	fetchTeachers: function(req, res) {
		var uid = req.query.uid || 2;

		db.Teacher.findAll()
		.then(function(teachers) {
			var result = [];
			teachers.forEach(function(teacher) {
				var currTeacher = {};
				currTeacher.name = teacher.firstname + ' ' + teacher.lastname;
				currTeacher.id = teacher.id;
				result.push(currTeacher);
			})
			console.log('teachers!',result);
			if (result.length === teachers.length) {
				res.json({data: result});
			}
		})
	},
	//this is called when the student selects a teacher/class to enroll in
	selectedTeacher: function(req, res) {
		var studentId = req.body.studentId;
		var teacherId = req.body.teacherId;

		db.Student.findById(studentId)
		.then(function(student) {
			student.setTeacher(teacherId);
			//grab questions from teacher 
			//populate db with all question from the teacher. 
// get questions and put them through a function
	// the resulting questionIDs  get marked as queued

			res.send(student);
			utils.addQuestionsCategoriesToStudent(teacherId, studentId);
		})
	}, 
	//this is called when the student asks for a report for him/herself
	getReport: function(req, res) {
		var uid = req.query.uid || 2;

		db.Student.findById(uid, {
			include: [{
				model: db.Question, 
				through: {
					attributes: ['answer', 'question', 'grade', 'answerDate'],
	    			where: {isAnswered: true, isGraded: true}
				}, 
				include: [db.Category]
			},
			{
		// 				db.Student.findAll({
		// 	include: [
		// 		{
		// 			model: db.Category,
		// 			as: 'Competency'
		// 		}
		// 	]
		// })
		// .then(function(result) {
		// 	console.log('result', result);
		// 	res.send(result)
		// })

     			model: db.Category,
     			as: 'Competency',
				through: {
					attributes: ['competencyScore', 'isImproving', 'createdAt', 'answerDate']
				}
			}]
		})
		.then(function(studentResult) {
			console.log('results found!', studentResult)
			// res.send(studentResult)
			// res.send(studentResult)
			var studentReport = {
				studentId: studentResult.id,
				name: studentResult.firstname + ' ' + studentResult.lastname,
				questionsAnswered: [],
				competency: []
			}

			studentResult.Questions.forEach(function(question) {
				var currQuestion = {
					questionId: question.id, 
					questionText: question.questionText,
					difficulty: question.difficulty,
					categoryId: question.categoryId,
					categoryName: question.Category.name,
					answer: question.StudentQuestion.answer,
					grade: question.StudentQuestion.grade,
					answerDate: question.StudentQuestion.answerDate
				};
				studentReport.questionsAnswered.push(currQuestion);
			})

			studentResult.Competency.forEach(function(category) {
				var currCategory = {
					categoryId: category.id,
					categoryName: category.name,
					competencyScore: category.IndividualCompetency.competencyScore,
					isImproving: category.IndividualCompetency.isImproving,

				}
				studentReport.competency.push(currCategory);
			})

			res.json({data: studentReport});
		})
	}
}; 

module.exports.teacher = teacher;
module.exports.student = student;
