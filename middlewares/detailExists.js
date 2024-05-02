const User = require('../models/userModel')

async function onlyMailExist (email){
    let user = await User.findOne({email: email})
        
    if(user === null){
        return false
    }else{
        return true
    }
}


module.exports =  onlyMailExist