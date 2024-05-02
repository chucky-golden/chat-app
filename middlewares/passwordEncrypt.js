const bcrypt = require('bcrypt');
// require environment variables
require('dotenv').config();
const salt = process.env.SALT;

async function password_encrypt($pass){    
    return await bcrypt.hash($pass, salt);
}

module.exports = password_encrypt;