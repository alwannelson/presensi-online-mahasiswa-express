const express = require('express')
const Router = express.Router()

const StudentLoginController = require('../controllers/student/Login')
const StudentLogoutController = require('../controllers/student/Logout')
const StudentCoursesController = require('../controllers/student/pages/Courses')
const StudentSettingsController = require('../controllers/student/pages/Settings')
const StudentTodayController = require('../controllers/student/pages/Today')
const StudentViewAttendanceController = require('../controllers/student/pages/ViewAttendance')
const StudentHelpController = require('../controllers/student/pages/Help.js')

const AcademicLoginController = require('../controllers/academic/Login.js')
const AcademicStudentsController = require('../controllers/academic/pages/StudentsController.js')
const AcademicDashboardController = require('../controllers/academic/pages/DashboardController.js')

const AuthMiddleware = require('../middlewares/auth-middleware')
const TimeMiddleware = require('../middlewares/time-middleware')
const SelfieMiddleware = require('../middlewares/selfie-middleware')

const controllers = {
    StudentLoginController,
    StudentLogoutController,
    StudentCoursesController,
    StudentSettingsController,
    StudentTodayController,
    StudentViewAttendanceController,
    StudentHelpController,

    AcademicLoginController,
    AcademicStudentsController,
    AcademicDashboardController
}

const middlewares = {
    AuthMiddleware,
    TimeMiddleware,
    SelfieMiddleware
}

Router.get('/', controllers.StudentLoginController.redirectLogin)
Router.get('/login', controllers.StudentLoginController.getLoginPage)
Router.post('/login', controllers.StudentLoginController.postLogin)
Router.get('/s/today', middlewares.AuthMiddleware.authCheck, controllers.StudentTodayController.getToday)
Router.get('/s/today/present/:slug', middlewares.AuthMiddleware.authCheck, middlewares.TimeMiddleware.timeCheck,
    controllers.StudentTodayController.getPresentBySlug
)
Router.post('/s/today/present/:slug/submit', middlewares.AuthMiddleware.authCheck, middlewares.TimeMiddleware.timeCheck,
    middlewares.SelfieMiddleware.single('photo'),
    controllers.StudentTodayController.submitPresensi
)

Router.post('/logout', middlewares.AuthMiddleware.authCheck, controllers.StudentLogoutController.logout)
Router.get('/s/courses', middlewares.AuthMiddleware.authCheck, controllers.StudentCoursesController.getCourses)
Router.get('/s/courses/:slug', middlewares.AuthMiddleware.authCheck, controllers.StudentCoursesController.getCourseBySlug)
Router.get('/s/view-attendance', middlewares.AuthMiddleware.authCheck, controllers.StudentViewAttendanceController.getViewAttendance)
Router.get('/s/settings', middlewares.AuthMiddleware.authCheck, controllers.StudentSettingsController.getSettings)
Router.post('/s/settings/update', middlewares.AuthMiddleware.authCheck, controllers.StudentSettingsController.updateStudent)
Router.get('/s/help', middlewares.AuthMiddleware.authCheck, controllers.StudentHelpController.getHelp)

//Academic routes
Router.get('/login/academic', controllers.AcademicLoginController.getAcademicLogin)
Router.post('/login/academic', controllers.AcademicLoginController.postAcademicLogin)
Router.get('/a/dashboard', middlewares.AuthMiddleware.authCheckAcademic, controllers.AcademicDashboardController.getDashboard)
Router.get('/a/students', middlewares.AuthMiddleware.authCheckAcademic, controllers.AcademicStudentsController.getStudentsPage)

module.exports = Router