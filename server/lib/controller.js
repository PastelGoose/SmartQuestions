var db = require('../db');

var testString= {"uid":1,"questions":[{"questionText":"what is the x kdjf","category":"recursion","difficulty":10},{"questionText":"y times kdjf","category":"logic","difficulty":1}]}

var teacher = {
	//this is called when the teach submits new questions. Note it can handle one question or multiple questions with each POST
	submitQuestions: function(req, res) {
		var submission = req.body;

		db.Teacher.findOne({where: {id: submission.uid}})
		.then(function(teacher) {

			var resultQuestions = [];
			submission.questions.forEach(function(question) {
				db.Question.findOrCreate({where: {questionText: question.questionText, difficulty: question.difficulty}})
				.spread(function(questionObj, createdQuestion) {
					return questionObj.setTeacher(teacher);
				})
				.then(function(questionSetTeacher) {					
					return db.Category.findOrCreate({where: {name: question.category}})
					.spread(function(category, createdCategory) {
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

		db.Question.findAll({where: {teacherId: uid}})
		.then(function(allQuestions) {
			res.json({data: allQuestions});
		})
	},
	//this is called when the teacher wants to see a list of questions that he/she still needs to grade
	gradeUnansweredQuestions: function(req, res) {
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
				}, db.Category]
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

		db.StudentQuestion.findOne({where: {StudentId: studentId, QuestionId: questionId}})
		.then(function(foundQuestion) {
			foundQuestion.updateAttributes({isGraded: 1, grade: grade});
			res.sendStatus(201);
		})
	},

	getReport: function(req, res) {
		var uid = req.query.uid || 1;
		//get all student ids
		//get studentquestions that are answered and graded
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
					through: {
						attributes: ['answer', 'question', 'grade'],
		    			where: {isAnswered: true, isGraded: true}
					}, 
					include: [db.Category]
				},
				{
					model: db.Category,
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
						var oneStudentReport = {
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
								grade: question.StudentQuestion.grade
							};
							oneStudentReport.questionsAnswered.push(currQuestion);
						})

						studentResult.Categories.forEach(function(category) {
							var currCategory = {
								categoryId: category.id,
								categoryName: category.name,
								competencyScore: category.StudentCategory.competencyScore,
								isImproving: category.StudentCategory.isImproving
							}
							oneStudentReport.competency.push(currCategory);
						})

						console.log('after scrubbing', oneStudentReport);
						allResults.push(oneStudentReport);
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
	//this is a testing endpoint. use this for testing new queries
	test: function(req, res) {
		var uid = req.query.uid || 2;
		db.Student.findById(uid, {
		  include: [{
		    model: db.Question,
		    include: [db.Category],
		    through: {
      		attributes: ['TeacherId', 'QuestionId', 'CategoryName', 'CategoryId'],
		      where: {isQueued: true}
		    }
		  }]
		})
		.then(function(student) {
			res.send(student);
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
	retrieveQuestions: function(req, res) {
		var uid = req.query.uid || 2;

		db.Student.findById(uid, {
		  include: [{
		    model: db.Question,
		    through: {
      			attributes: ['TeacherId', 'QuestionId', 'confidenceScore', 'isAnswered', 'orderInQueue', 'difficulty', 'CategoryId'],
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
							question: question.question,
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

			res.sendStatus(201);
		})
	}
}; 

module.exports.teacher = teacher;
module.exports.student = student;
