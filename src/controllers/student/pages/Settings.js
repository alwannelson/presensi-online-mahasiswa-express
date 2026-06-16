const db = require('../../../configs/db')

exports.getSettings = async (req, res) => {
    try {
        const page = 'settings'
        const nim = req.user.nim
        const [rows] = await db.execute(
            `SELECT * FROM students WHERE nim = ?`, [nim]
        )
        const user = {
            fullname: rows[0].fullname,
            nickname: rows[0].nickname,
            nim,
            major: req.user.major,
            major_code: req.user.major_code
        }

        if (rows.length === 0) {
            req.flash('error', 'Sesi tidak ditemukan. Harap login ulang.')
            return res.redirect('/login')
        }

        const userInfo = rows[0]
        console.log(userInfo)

        res.status(200).render('s/dashboard', {
            title: `Cek kehadiran ${userInfo.nickname}`,
            layout: 's/layouts/main',
            page,
            user,
            userInfo,
            activeMenu: 'settings',
            scripts: `
            <script src="/js/s.settings.js"></script>
            `,
            error: req.flash('error')[0],
            success: req.flash('success')[0]
        })
    } catch (error) {
        res.status(500).render('err/500', {
            layouts: 'err/500'
        })
    }
}

exports.updateStudent = async (req, res) => {
    try {
        const { newNickname, newEmail, newTelephone, newAddress } = req.body
        const studentNIM = req.user.nim
        const validNickname = req.user.nickname

        const [emailUnique] = await db.execute(
            `SELECT * FROM students WHERE email = ?`, [newEmail]
        )

        // if (emailUnique.length >= 1) {
        //     req.flash('error', 'Maaf, email sudah digunakan.')
        //     return res.redirect('/s/settings')
        // }

        const [update] = await db.execute(
            `UPDATE students SET nickname = ?, email = ?, telephone = ?, address = ? WHERE nim = ?`,
            [newNickname, newEmail, newTelephone, newAddress, studentNIM]
        )

        const [rows] = await db.execute(
            'SELECT * FROM students WHERE nim = ?', [studentNIM]
        )

        req.flash('success', `Berhasil update data.`)
        return res.redirect('/s/settings')
    } catch (error) {
        console.log(error)
        return res.redirect('/s/settings')
    }
}