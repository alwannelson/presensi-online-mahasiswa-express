const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.SECRET_KEY

exports.tokenCheck = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            req.flash('error', 'Harap login terlebih dahulu.')
            return res.redirect('/login/')
        }
        
        const decoded = jwt.verify(token, secretKey)
        req.user = decoded
        next()
    } catch (err) {
        console.log(err)
        req.flash('error', 'Sesi telah berakhir. Harap login ulang.')
        return res.redirect('/login/')
    }
}

exports.roleCheck = (...role) => {
    return function (req, res, next) {
        if (!role.includes(req.user.role)) {
            req.flash('error', 'Maaf kredensial tidak cocok. Harap login ulang.')
            return res.redirect('/login')
        } else {
            next()
        }
    }
}