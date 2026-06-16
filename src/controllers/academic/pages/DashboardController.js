const db = require("../../../configs/db")


exports.getDashboard = async (req, res) => {
    try {
        const nip = req.user.nip
        const [rows] = await db.execute(
            `SELECT * FROM academic WHERE nip = ?`,
            [nip]
        )
        const [amountStudents] = await db.execute(
            `SELECT 
                (SELECT COUNT(*) FROM students) AS students,
                (SELECT COUNT(*) FROM lecturers) AS lecturers,
                (SELECT COUNT(*) FROM courses) AS courses,
                (SELECT COUNT(*) FROM attendance) AS attendance   
            `
        )
        const amount = amountStudents[0]
        const user = rows[0]
        res.status(200).render('a/dashboard', {
            title: 'Dashboard',
            layout: 'a/layouts/main-layout',
            error: req.flash('error')[0],
            success: req.flash('success')[0],
            info: req.flash('info')[0],
            user,
            amount,
            activeMenu: 'dashboard',
            scripts: ''
        })
    } catch (error) {
        
    }
}