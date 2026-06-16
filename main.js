const express = require('express')
const app = express()
require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const port = process.env.APP_PORT
const routes = require('./src/router/routes')
const session = require('express-session')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/views'))

app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(expressLayouts)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './src/public')))
app.use(flash())
app.use('/', routes)
app.use('/', (req, res) => {
        res.status(404).render('err/404', {
        title: 'error 404',
        layout: 'err/404'
    })
})

app.listen(port, () => {
    console.log(`app running on port ${port}`)
})