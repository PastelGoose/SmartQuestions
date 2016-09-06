var router = require('express').Router();
var controller = require('./controller');

//allow teachers to submit question sets
router.post('/teacher/problemset', controller.teacher.submitProblems);

//allow students to get and post personalized questions
router.get('/student/questions', controller.student.retrieveQuestions);
router.post('/student/questions', controller.student.respondOne);


module.exports = router;