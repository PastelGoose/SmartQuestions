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
			category: 'recursion',
			difficulty: 10,
			answered: false,
			order: 1
		},
		{
			questionId: 2,
			question: 'what\'s one times seven',
			category: 'logic',
			difficulty: 10,
			answered: false,
			order: 2
		}
	]
};

var dani = {
 uid: 1,
 questions : [
 { question: 'what is the x kdjf',
 category: 'recursion',
 difficulty: 10
 },
 { question: 'y times kdjf',
 category: 'logic',
 difficulty: 1
 }
 ]
 }

 var testSTring= {"uid":1,"questions":[{"question":"what is the x kdjf","category":"recursion","difficulty":10},{"question":"y times kdjf","category":"logic","difficulty":1}]}

var teachersumit = {
uid: 1,
questions: [
{ question: 'what is the x kdjfd',
category: 'recursion',
difficulty: 10
},
{ question: 'y times kdjfd',
category: 'logic',
difficulty: 1
}
]
}

var teacher = {
	submitQuestions: function(req, res) {
		console.log('req body', req.body)
		var submission = req.body;

		db.Teacher.findOne({where: {id: submission.uid}})
		.then(function(teacher) {

			var resultQuestions = [];
			submission.questions.forEach(function(question) {

				db.Question.findOrCreate({where: {question: question.question, difficulty: question.difficulty}})
				.spread(function(questionObj, createdQuestion) {

					db.Category.findOrCreate({where: {name: question.category}})
					.spread(function(category, createdCategory) {

						questionObj.setTeacher(teacher)
						.then(function(questionSetTeacher) {

							questionSetTeacher.setCategory(category)
							.then(function(questionSetCategory) {

								resultQuestions.push(questionSetCategory.get({plain: true}));
								if (resultQuestions.length === submission.questions.length) {
									res.json({data: resultQuestions});
								}
							})
						})
					})
				})
			})
		})
	},
	retrieveAllQuestions: function(req, res) {
	console.log(req.body, req.params, req.query.uid)
	var uid = req.query.uid;

	// db.Student.findById(uid)
	// .then(function(student) {
	// 	console.log('student', student);

		db.Question.findAll({where: {teacherId: uid}})
		.then(function(allQuestions) {

			console.log('allQuestions', allQuestions);
			res.json({data: allQuestions});

			// allQuestions.forEach(function(eachQuestion) {
			// 	student.addQuestion(eachQuestion, {isViewed: 1})
			// })
		})
		// })
	}
};


var student = {
	test: function(req, res) {
		var uid = req.query.uid || 2;

		db.Student.findById(uid, {
		  include: [{
		    model: db.Question,
		    through: {
      		attributes: ['TeacherId', 'QuestionId'],
		      where: {isQueued: true}
		    }
		  }]
		})
		.then(function(student) {
			console.log('joint found!', student);
			res.send(student);
		})
	},

	// [ { dataValues:
 //     { isViewed: true,
 //       isAnswered: true,
 //       answer: 'x is the multiple',
 //       confidenceScore: null,
 //       isQueued: false,
 //       orderInQueue: null,
 //       QuestionId: 2,
 //       StudentId: 2 },
 //    _previousDataValues:

	respondOne: function(req, res) {
		var uid = req.query.uid || 2;
		var response = req.body;
		db.StudentQuestion.findOne({where: {StudentId: response.uid, QuestionId: response.questionId}})
		.then(function(foundQuestion) {
			foundQuestion.updateAttributes({isViewed: 1, answer: response.answer});
			console.log('found!', foundQuestion);
			res.send(foundQuestion);
		})
		// db.Student.findOne({where: {id: response.uid}})
		// .then(function(student) {
		// 	db.Question.findOne({where: {id: response.questionId}})
		// 	.then(function(question) {
		// 		student.addQuestion(question, {isAnswered: 1, answer: response.answer})
		// 		.then(function(added) {
		// 			console.log('added')
		// 		})
				
		// 	})
		// })
		// user.addProject(project, { role: 'manager', transaction: t });

		//find quesstion and student id. input response. mark as completed. 
		// response.questionId
		// response.answer
		// res.sendStatus(201);
		// Person.hasOne(Person, {as: 'Father', foreignKey: 'DadId'})
	},
	retrieveQuestions: function(req, res) {
		var uid = req.query.uid || 2;

		db.Student.findById(uid, {
		  include: [{
		    model: db.Question,
		    through: {
      			attributes: ['TeacherId', 'QuestionId', 'confidenceScore', 'isAnswered', 'orderInQueue', 'difficulty', 'CategoryId'],
		    	where: {isQueued: true}
		    }
		  }]
		})
		.then(function(result) {
			console.log('result', result)
			var result = result.get({plain: true});
			// console.log('joint found! result:', student.get({plain: true}));
			if (result.Questions.length !== 0) {
				var questionArray = [];
				console.log('found questions----------------->', result)
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
							//order, difficulty, categories
						}
						questionArray.push(currQuestion);
						if(questionArray.length === result.Questions.length) {
							res.json({data: questionArray});
						}
						
					})
				})
			} else {
				console.log('did not find questions')
				res.send(null);
			}
		})
	},

}; 

// {
//   "id": 2,
//   "firstname": "damien",
//   "lastname": "mccool",
//   "username": "mrteacher",
//   "password": "hackreactor",
//   "TeacherId": 1,
//   "Questions": [
//     {
//       "id": 1,
//       "question": "what is the x kdjf",
//       "difficulty": 10,
//       "TeacherId": 1,
//       "CategoryId": 1,
//       "StudentQuestion": {
//         "QuestionId": 1,
//         "confidenceScore": 3,
//         "isAnswered": false,
//         "orderInQueue": null
//       }
//     },
//     {
//       "id": 2,
//       "question": "y times kdjf",
//       "difficulty": 1,
//       "TeacherId": 1,
//       "CategoryId": 2,
//       "StudentQuestion": {
//         "QuestionId": 2,
//         "confidenceScore": 3,
//         "isAnswered": false,
//         "orderInQueue": null
//       }
//     },
//     {
//       "id": 3,
//       "question": "why do cats cross the street",
//       "difficulty": 10,
//       "TeacherId": 1,
//       "CategoryId": 1,
//       "StudentQuestion": {
//         "QuestionId": 3,
//         "confidenceScore": 3,
//         "isAnswered": false,
//         "orderInQueue": null
//       }
//     }
//   ]
// }
//         data: [
//                 {
//                         questionId: 1,
//                         question: 'what\'s one times seven',
//                         categories: 'recursion',
//                         difficulty: 10,
//                         answered: false,
//                         order: 1

// {
//   "id": 2,
//   "firstname": "damien",
//   "lastname": "mccool",
//   "username": "mrteacher",
//   "password": "hackreactor",
//   "TeacherId": 1,
//   "Questions": [
//     {
//       "id": 1,
//       "question": "what is the x kdjf",
//       "difficulty": 10,
//       "TeacherId": 1,
//       "CategoryId": 1,
//       "StudentQuestion": {
//         "QuestionId": 1,
//         "confidenceScore": 3,
//         "isAnswered": false
//       }
//     },
//     {
//       "id": 2,
//       "question": "y times kdjf",
//       "difficulty": 1,
//       "TeacherId": 1,
//       "CategoryId": 2,
//       "StudentQuestion": {
//         "QuestionId": 2,
//         "confidenceScore": 3,
//         "isAnswered": false
//       }
//     },
//     {
//       "id": 3,
//       "question": "why do cats cross the street",
//       "difficulty": 10,
//       "TeacherId": 1,
//       "CategoryId": 1,
//       "StudentQuestion": {
//         "QuestionId": 3,
//         "confidenceScore": 3,
//         "isAnswered": false
//       }
//     }
//   ]
// }


// You should be able to load everything in one go using nested includes:

// User.findAll({
//   include: [
//     {
//       model: Team, 
//       include: [
//         Folder
//       ]  
//     }
//   ]
// });
// Post.findAll({
//     include: [{
//         model: PostLike,
//         where: { author_id: 123 }
//     }]
// })


module.exports.teacher = teacher;
module.exports.student = student;
