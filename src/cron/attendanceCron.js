const cron = require('node-cron')
const db = require('../configs/db')

cron.schedule('*/10 * * * *', async () => {
    const [students]
})