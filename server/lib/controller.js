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
	submitProblems: function(req, res) {
		var submission = req.body;

		db.Teacher.findOne({where: {id: submission.uid}})
		.then(function(teacher) {

			var resultProblems = [];
			submission.questions.forEach(function(question) {

				db.Question.findOrCreate({where: {question: question.question, difficulty: question.difficulty}})
				.spread(function(questionObj, createdQuestion) {

					db.Category.findOrCreate({where: {name: question.category}})
					.spread(function(category, createdCategory) {

						questionObj.setTeacher(teacher)
						.then(function(questionSetTeacher) {

							questionSetTeacher.setCategory(category)
							.then(function(questionSetCategory) {

								resultProblems.push(questionSetCategory.get({plain: true}));
								if (resultProblems.length === submission.questions.length) {
									res.json({data: resultProblems});
								}
							})
						})
					})
				})
			})
		})
	}
};


var student = {
	test: function(req, res) {
		console.log(req.body, req.params, req.query.uid)
		var uid = req.query.uid;

		db.Student.findById(uid)
		.then(function(student) {
			console.log('student', student);

			db.Question.findAll({where: {teacherId: student.get('TeacherId')}})
			.then(function(allQuestions) {

				console.log('allQuestions', allQuestions);
				res.json({data: allQuestions});

				// allQuestions.forEach(function(eachQuestion) {
				// 	student.addQuestion(eachQuestion, {isViewed: 1})
				// })
			})
		})
	},

	respondOne: function(req, res) {
		var uid = req.query.uid;
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
		console.log(req.body, req.params, req.query.uid)
		var uid = req.query.uid;

		db.Student.findById(uid)
		.then(function(student) {
			console.log('student', student);

			db.Question.findAll({where: {teacherId: student.get('TeacherId')}})
			.then(function(allQuestions) {

				console.log('allQuestions', allQuestions);
				res.json({data: allQuestions});

				// allQuestions.forEach(function(eachQuestion) {
				// 	student.addQuestion(eachQuestion, {isViewed: 1})
				// })
			})
		})
	}
}; 

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
