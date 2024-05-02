const User = require('../models/userModel');
const passwordEncrypt = require('../middlewares/passwordEncrypt');
const detailExists = require('../middlewares/detailExists');

const registerLoad = async (req, res) => {
    try{
        res.render('register')
    }catch(err){
        console.log(err.message);
    }
}



const register = async (req, res) => {
    try{
        if (req.file === undefined) {
            res.render('register', { message: 'Please upload an image', errorcode : '1' })
            return false;
        }

        const name = req.body.name
        const email = req.body.email
        const password = await passwordEncrypt(req.body.password)

        var details = await detailExists(email);

        if(details === false){
            const user = await new User({
                name: name,
                email: email,
                image: req.file.filename,
                password: password,
            }).save()

            if(user !== null){
                res.render('register', { message: 'Registration successful', errorcode : '0' })
            }else{
                res.render('register', { message: 'Registration failed', errorcode : '1' })
            }
        }else{
            res.render('register', { message: 'Emaill address already taken', errorcode : '1' })
        }


    }catch(err){
        console.log(err.message); 
    }    
}


const loadLogin = async (req, res) => {
    try{
        res.render('login')
    }catch(err){
        console.log(err.message);
    }
}


const login = async (req, res) => {
    try{
        const email = req.body.email
        const password = await passwordEncrypt(req.body.password)

        const userData = await User.findOne({ email: email, password: password })
        if(userData){
            req.session.user = userData
            res.redirect('/dashboard')
        }else{
            res.render('login', { message: 'Emaill or password is incorrect', errorcode : '1' })
        }
    }catch(err){
        console.log(err.message);
    }
}


const logout = async (req, res) => {
    try{
        req.session.destroy()
        res.redirect('/')
    }catch(err){
        console.log(err.message);
    }
}


const loadDashboard = async (req, res) => {
    try{
        let users = await User.find({ _id: { $ne: req.session.user._id } })

        res.render('dashboard', { user:req.session.user, users:users })
    }catch(err){
        console.log(err.message);
    }
}


module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard
}