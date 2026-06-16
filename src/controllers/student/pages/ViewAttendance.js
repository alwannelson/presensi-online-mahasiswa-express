const db = require('../../../configs/db')

exports.getViewAttendance = async function (req, res) {
    try {
        const page = 'view-attendance'
        const nim = req.user.nim
        const [rows] = await db.query('SELECT * FROM students WHERE nim = ?', [nim])
        const user = {
            fullname: rows[0].fullname,
            nickname: rows[0].nickname,
            major: req.user.major,
            nim,
            major_code: req.user.major_code
        }

        res.status(200).render('s/dashboard', {
            title: `Cek kehadiran ${rows[0].nickname}`,
            layout: 's/layouts/main',
            page,
            user,
            activeMenu: 'view-attendance',
            error: req.flash('error')[0],
            success: req.flash('success')[0]
        })
    } catch (error) {
        res.status(500).render('err/500', {
            layouts: 'err/500'
        })
    }
}