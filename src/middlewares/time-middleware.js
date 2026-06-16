const db = require('../configs/db')

exports.timeCheck = async (req, res, next) => {
    try {
        const { slug } = req.params

        const now = new Date()
        const today = now.getDay()
        const [checkDay] = await db.execute('SELECT * FROM schedules WHERE day = ?', [today])
        const [checkSlug] = await db.execute('SELECT * FROM courses WHERE slug = ?', [slug])
        const serverDate = now.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        
        const serverTime = now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
    
        if (checkDay.length === 0 || checkSlug.length === 0) {
            return res.status(403).render('err/403', {
                layout: 'err/403',
                serverDate,
                serverTime
            })
        }
        next()
    } catch (error) {
        console.log(error)
    }
}