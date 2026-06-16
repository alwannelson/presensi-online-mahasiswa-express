const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.SECRET_KEY

exports.authCheck = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            req.flash('error', 'Harap login terlebih dahulu.')
            return res.redirect('/login/')
        }

        const decoded = jwt.verify(token, secretKey)
        req.user = decoded
        if (decoded.role !== 'student') {
            req.flash('error', 'Sesi tidak ditemukan. Harap login ulang.')
            return res.redirect('/login/')
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        req.flash('error', 'Sesi telah berakhir. Harap login ulang.')
        return res.redirect('/login/')
    }
}

exports.authCheckAcademic = (req, res, next) => {
    try {
        const token = req.cookies.token
        
        if (!token) {
            req.flash('error', 'Harap login terlebih dahulu.')
            return res.redirect('/login/academic')
        }

        const decoded = jwt.verify(token, secretKey)
        req.user = decoded
        console.log(decoded)
        if (decoded.role !== 'academic') {
            req.flash('error', 'Sesi tidak ditemukan. Harap login ulang.')
            return res.redirect('/login/academic')
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        req.flash('error', 'Sesi telah berakhir. Harap login ulang.')
        return res.redirect('/login/academic')
    }

}