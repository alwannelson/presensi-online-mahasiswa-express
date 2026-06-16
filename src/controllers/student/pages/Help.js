const db = require('../../../configs/db')

exports.getHelp = async (req, res) => {
    const page = 'help'
    const userNIM = req.user.nim
    const [rows] = await db.execute(
        `SELECT * FROM students WHERE nim = ?`, [userNIM]
    )
    const user = {
        fullname: rows[0].fullname,
        nickname: rows[0].nickname,
        major: req.user.major,
        major_code: req.user.major_code
    }

    res.status(200).render('s/dashboard', {
        title: 'Bantuan & FAQ',
        layout: 's/layouts/main',
        page,
        user,
        activeMenu: page,
        error: req.flash('error')[0],
        success: req.flash('success')[0]
    })
}