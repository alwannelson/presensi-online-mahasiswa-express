const db = require('../../configs/db')
const verifyPassword = require('../../utils/verify-hash')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const boolCheck = require('../../utils/string-to-bool')
const secretKey = process.env.SECRET_KEY

exports.redirectLogin = (req, res) => {
    res.redirect('/login/')
}

exports.getLoginPage = (req, res) => {
    // const error = req.flash('error')
    // const success = req.flash('success')
    res.status(200).render('layouts/index', {
        title: 'Login',
        layout: 'layouts/index',
        error: req.flash('error')[0],
        success: req.flash('success')[0]
    })
}

exports.postLogin = async (req, res) => {
    try {
        const { username, password, role } = req.body

        if (role === 'student') {
            const [rows] = await db.execute(
                `SELECT * FROM students WHERE nim = ?`, [username]
            )

            if (rows.length === 0) {
                req.flash('error', 'NIM tidak ditemukan.')
                return res.status(400).redirect('/login')
            }

            if (isNaN(username)) {
                req.flash('error', 'NIM harus berupa angka.')
                return res.redirect('/login')
            }

            if (username.length < 7 || username.length > 7) {
                req.flash('error', 'NIM harus 7 digit angka.')
                return res.redirect('/login')
            }

            if (password.includes(' ')) {
                req.flash('error', 'Password tidak boleh mengandung spasi.')
                return res.redirect('/login')
            }

            const user = rows[0]
            const hashedPassword = rows[0].password
            const checkPassword = await verifyPassword(password, hashedPassword)
            let completeMajor

            if (user.major === 'SI') {
                completeMajor = 'Sistem Informasi'
            } else if (user.major === 'MI') {
                completeMajor = 'Manajemen Informatika'
            } else if (user.major === 'SK') {
                completeMajor = 'Sistem Komputer'
            } else {
                completeMajor = 'Unknown'
            }

            let token
            if (!checkPassword) {
                req.flash('error', 'Kata sandi anda salah.')
                return res.redirect('/login')
            } else {
                token = jwt.sign(
                    {
                        nim: user.nim,
                        name: user.fullname,
                        major: completeMajor,
                        major_code: user.major,
                        nickname: user.nickname,
                        role: 'student'
                    },
                    secretKey,
                    { expiresIn: '1h' }
                )
            }

            const fromEnvHttpOnly = boolCheck(process.env.HTTP_ONLY)
            const fromEnvSecure = boolCheck(process.env.SECURE)

            res.cookie('token', token, {
                httpOnly: fromEnvHttpOnly,
                secure: fromEnvSecure,
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            req.flash('success', `Welcome, ${rows[0].nickname}`)
            return res.redirect('/s/today')
        }
    } catch (error) {
        console.log(error)
        res.status(500).render('err/500', {
            layout: 'err/500'
        })
    }
}