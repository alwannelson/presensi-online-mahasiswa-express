const bcrypt = require('bcrypt')

const verifyPassword = async (plainTextPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    return isMatch; // Returns true or false
}

module.exports = verifyPassword