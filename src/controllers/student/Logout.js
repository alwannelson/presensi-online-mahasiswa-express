exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    })
    const nickname = req.user.nickname
    req.flash('success', `Bye ${nickname}`)
    return res.redirect('/login')
}