// require('dotenv').config()

// const onlyHTTP = process.env.HTTP_ONLY

function boolCheck(string) {
    if (string === 'true') {
        return true
    } else if (string === 'false') {
        return false
    } else {
        return 'unknown bool'
    }
}

module.exports = boolCheck