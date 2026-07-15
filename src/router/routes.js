const express = require('express')
const Router = express.Router()

const globalController = {
    logout: require('../controllers/student/Logout')
}

const studentControllers = {
    login: require('../controllers/student/Login'),
    courses: require('../controllers/student/pages/Courses'),
    settings: require('../controllers/student/pages/Settings'),
    today: require('../controllers/student/pages/Today'),
    viewAttendance: require('../controllers/student/pages/ViewAttendance'),
    help: require('../controllers/student/pages/Help.js')
}

const academicControllers = {
    login: require('../controllers/academic/Login'),
    students: require('../controllers/academic/pages/StudentsController.js'),
    dashboard: require('../controllers/academic/pages/DashboardController.js')
}

const middlewares = {
    auth: require('../middlewares/auth-middleware'),
    time: require('../middlewares/time-middleware.js'),
    selfie: require('../middlewares/selfie-middleware')
}

Router.get('/', studentControllers.login.redirectLogin)

Router.get('/login', studentControllers.login.getLoginPage)

Router.post('/login', studentControllers.login.postLogin)

Router.get('/s/today',
    middlewares.auth.tokenCheck,
    middlewares.auth.roleCheck('student'),
    studentControllers.today.getToday
)

Router.get('/s/today/present/:slug', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('student'),
    middlewares.time.timeCheck,
    studentControllers.today.getPresentBySlug
)

Router.post('/s/today/present/:slug/submit', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('student'),
    middlewares.time.timeCheck,
    middlewares.selfie.single('photo'),
    studentControllers.today.submitPresensi
)

Router.post('/logout', 
    middlewares.auth.tokenCheck,
    globalController.logout.logout
)
Router.get('/s/courses', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('student'),
    studentControllers.courses.getCourses
)

Router.get('/s/courses/:slug', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('student'), 
    studentControllers.courses.getCourseBySlug
)

Router.get('/s/view-attendance', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('student'),
    studentControllers.viewAttendance.getViewAttendance
)

Router.get('/s/settings', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('student'),
    studentControllers.settings.getSettings
)

Router.post('/s/settings/update', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('student'),
    studentControllers.settings.updateStudent

)
Router.get('/s/help', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('student'),
    studentControllers.help.getHelp
)

//Academic routes
Router.get('/login/academic', 
    academicControllers.login.getAcademicLogin
)

Router.post('/login/academic', 
    academicControllers.login.postAcademicLogin
)

Router.get('/a/dashboard', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('academic'), 
    academicControllers.dashboard.getDashboard
)

Router.get('/a/students', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('academic'), 
    academicControllers.students.getStudentsPage
)

Router.get('/a/students/new-student', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('academic'),  
    academicControllers.students.getNewStudentPage
)

Router.get('/a/students/edit-student/:nim',
    middlewares.auth.tokenCheck,
    middlewares.auth.roleCheck('academic'),
    academicControllers.students.getEditStudentPage
)

Router.post('/a/students/edit-student/:nim_params', 
    middlewares.auth.tokenCheck,
    middlewares.auth.roleCheck('academic'),
    academicControllers.students.updateStudent
)

Router.post('/a/students/new-student', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('academic'), 
    academicControllers.students.postNewStudent
)
Router.delete('/a/delete-student/:nim', 
    middlewares.auth.tokenCheck, 
    middlewares.auth.roleCheck('academic'), 
    academicControllers.students.deleteStudent
)

module.exports = Router