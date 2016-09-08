var router = require('express').Router();
var controller = require('./controller');

//allow teachers to submit question sets
router.get('/teacher/questions', controller.teacher.retrieveAllQuestions);
router.post('/teacher/questions', controller.teacher.submitQuestions);

router.get('/teacher/grading', controller.teacher.gradeUnansweredQuestions);
router.post('/teacher/grading', controller.teacher.postGrades);

router.get('/teacher/report', controller.teacher.getReport);

//allow students to get and post personalized questions
router.get('/student/questions', controller.student.retrieveQuestions);
router.post('/student/questions', controller.student.respondOne);

router.get('/student/teachers', controller.student.fetchTeachers);
router.post('/student/teachers', controller.student.selectedTeacher);

router.get('/student/report', controller.student.getReport);

router.get('/test', controller.student.test);


module.exports = router;