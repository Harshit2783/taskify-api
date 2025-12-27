const User = require('../models/User')

const register = async (req, res)=>{ // For user registration.
    try{
        let user = await User.findOne({email: req.body.email}).select('-password') // Don't use find(), it returns [] even if no record found and [] is truthy in JS.
                                                                                   // See about "select('-password')" below.
        if(!user)
        {
            user = await User.create(req.body) // We don't need to use "let user" here, we already declared it above. 
            res.status(201).send(`${user.name} registered successfully`) // Obvious but still a reminder: Here the "user" outside if block and the one inside if block are different.
        }
        else
        {
            res.status(409).json({"Error":"User already exists"})
        }
    }
    catch(error){
        res.status(500).json({"Error": error.message})
    }
}
/* This ".select('-password')" EXCLUDES THE password from the returned object(It means 'user' variable doesn't recieve the actual 
password which is already saved in db but req.body still has the password sent by user, remember both password might be different 
also). We do this cuz' this prevents mistakenly sending the password in response. But we haven't done this in the login function 
cuz' there we need the password for checking if the user has entered correct password or not. */

const login = async (req, res)=>{  // For user login.
    try{
        let user = await User.findOne({email: req.body.email})
        if(!user)
        {
            res.status(404).send("User Not Found, Register First")
        }
        else
        {
            if(user.password == req.body.password) // Here we are checking if the user has entered correct password or not. That means if the password sent by user(req.body.password) matches the password saved in db(user.password).
            {res.status(200).send("Login Successful")}
            else
            {res.status(401).send("Wrong password")}
        }
    }
    catch(error){
        res.status(500).json({"Error": error.message})
    }
}

module.exports = {register,login}