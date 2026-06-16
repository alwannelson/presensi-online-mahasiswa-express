const db = require('../../configs/db')
const verifyPassword = require('../../utils/verify-hash')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const boolCheck = require('../../utils/string-to-bool')
const secretKey = process.env.SECRET_KEY

exports.getAcademicLogin = async (req, res) => {
    res.status(200).render('a/login', {
        layout: 'a/login',
        title: 'Login Akademik',
        error: req.flash('error')[0],
        success: req.flash('success')[0],
        info: req.flash('info')[0],
        email: req.cookies?.rememberEmail || '',
        remember: !!req.cookies?.rememberEmail
    })
}

exports.postAcademicLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        const [rows] = await db.execute(
            `SELECT * FROM academic WHERE nickname = ?`,
            [username]
        )

        if (rows.length === 0) {
            req.flash('error', 'Username tidak ditemukan.')
            return res.redirect('/login/academic')
        }
        const hashed = rows[0].password
        const verif = await verifyPassword(password, hashed)
        const user = rows[0]
        let token

        if (!verif) {
            req.flash('error', 'Password salah.')
            return res.redirect('/login/academic')
        } else {
            token = jwt.sign(
                {
                    fullname: user.fullname,
                    nip: user.nip,
                    position: user.position,
                    role: 'academic'
                },
                secretKey,
                { expiresIn: '1d' }
            )
        }

        const fromEnvHttpOnly = boolCheck(process.env.HTTP_ONLY)
        const fromEnvSecure = boolCheck(process.env.SECURE)
        console.log(token)

        res.cookie('token', token, {
            httpOnly: fromEnvHttpOnly,
            secure: fromEnvSecure,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        req.flash('success', `Welcome, ${user.nickname}`)
        res.redirect('/a/dashboard')
    } catch (error) {
        console.log(error)
    }
}