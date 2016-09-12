var router = require('express').Router();
var controller = require('./controller');

//allow teacher to get a list of his/her existing questions
router.get('/teacher/questions', controller.teacher.retrieveAllQuestions);
//allow teachers to submit questions or add new questions
router.post('/teacher/questions', controller.teacher.submitQuestions);
//allow teacher to get unanswered questions to grade them
router.get('/teacher/grading', controller.teacher.getUngradedQuestions);
//allow teacher to submit a grade
router.post('/teacher/grading', controller.teacher.postGrades);
//allow teacher to get a report of his/her students' performance
router.get('/teacher/report', controller.teacher.getReport);
//allow teacher to get a list of his/her students that are enrolled
router.get('/teacher/students', controller.teacher.getStudents);


//allow students to get personalized questions
router.get('/student/questions', controller.student.retrieveSmartQuestions);
//allow students to submmit an answer
router.post('/student/questions', controller.student.respondOne);
//allow students to get a list of teachers in order to pick from them
router.get('/student/teachers', controller.student.fetchTeachers);
//allow students to select a teacher to enroll in the teacher's class
router.post('/student/teachers', controller.student.selectedTeacher);
//allow students to get his/her individualized report
router.get('/student/report', controller.student.getReport);

//a test endpoint when developer is writing new code in order to not impact other endpoints
router.get('/test', controller.student.test);


module.exports = router;