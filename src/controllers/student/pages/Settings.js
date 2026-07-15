const db = require('../../../configs/db')
const bcrypt = require('bcrypt')

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
        const { newNickname, newEmail, newTelephone, newAddress, newPassword } = req.body
        const studentNIM = req.user.nim

        // Buat object untuk menyimpan field yang akan diupdate
        const updateFields = {}
        const updateValues = []

        // Cek dan tambahkan field yang tidak kosong
        if (newNickname !== undefined && newNickname !== '') {
            updateFields.nickname = newNickname
            updateValues.push(newNickname)
        }

        if (newEmail !== undefined && newEmail !== '') {
            updateFields.email = newEmail
            updateValues.push(newEmail)
        }

        if (newTelephone !== undefined && newTelephone !== '') {
            updateFields.telephone = newTelephone
            updateValues.push(newTelephone)
        }

        if (newAddress !== undefined && newAddress !== '') {
            updateFields.address = newAddress
            updateValues.push(newAddress)
        }

        if (newPassword !== undefined && newPassword !== '') {
            const hashed = await bcrypt.hash(newPassword, 12)
            updateFields.password = hashed
            updateValues.push(hashed)
        }

        // Jika tidak ada field yang diupdate, redirect dengan pesan
        if (Object.keys(updateFields).length === 0) {
            req.flash('info', 'Tidak ada data yang diupdate.')
            return res.redirect('/s/settings')
        }

        // Cek unique email jika email diupdate
        if (updateFields.email) {
            const [emailUnique] = await db.execute(
                `SELECT * FROM students WHERE email = ? AND nim != ?`,
                [updateFields.email, studentNIM]
            )

            if (emailUnique.length >= 1) {
                req.flash('error', 'Maaf, email sudah digunakan.')
                return res.redirect('/s/settings')
            }
        }

        // Buat query dinamis
        const setClause = Object.keys(updateFields)
            .map(field => `${field} = ?`)
            .join(', ')

        // Tambahkan NIM ke values
        updateValues.push(studentNIM)

        const [update] = await db.execute(
            `UPDATE students SET ${setClause} WHERE nim = ?`,
            updateValues
        )

        // Ambil data terbaru
        const [rows] = await db.execute(
            'SELECT * FROM students WHERE nim = ?', [studentNIM]
        )

        req.flash('success', 'Berhasil update data.')
        return res.redirect('/s/settings')

    } catch (error) {
        console.log(error)
        req.flash('error', 'Terjadi kesalahan saat update data.')
        return res.redirect('/s/settings')
    }
}