const User = require('../models/User')

const registerUser = async (req, res)=>{ // For user registration.
    try{
        let user = await User.findOne({email: req.body.email}).select('-password') // Don't use find(), it returns [] even if no record found and [] is truthy in JS.
                                                                                   // See about "select('-password')" below.
        if(!user)
        {
            user = await User.create(req.body) // We don't need to use "let user" here, we already declared it above. 
            res.status(201).send(`${user.name} registered successfully`) // Obvious but still a reminder: Here the "user" outside if block and the one inside if block are same variable BUT USED FOR DIFFERENT WORK.
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
also). We do this cuz' this prevents mistakenly sending the password in response. But we haven't done this in the loginUser function 
cuz' there we need the password for checking if the user has entered correct password or not. */

const loginUser = async (req, res)=>{  // For user login.
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

module.exports = {registerUser, loginUser}

/*
Note: Now here(authController.js + authRoutes.js) we are only doing user authentication so this should be clarified.

One-line summary(Read the details below):-

Authentication = verifying identity
JWT = remembering that verification across requests

They are related, but not the same thing.

1️⃣ What does authentication ACTUALLY mean?

Authentication = proving who you are

That’s it. Nothing more.
Examples: “I am Alice → here is my password”

If the system can verify your identity, authentication is done.

👉 Authentication does NOT mean protection
👉 Authentication does NOT mean permissions
👉 Authentication does NOT mean access control

Those are different concepts.

2️⃣ What we implemented here
we did two things:

✅ Register
Store identity info (email + password)

✅ Login
Check:
- Does this user exist?
- Is the password correct?
If yes → identity is verified.

🎯 That is 100% authentication

Even though:
- No JWT
- No protected routes
- No sessions

Authentication already happened.

3️⃣ Then why does it feel incomplete?

Because of this missing question:
“Okay… but how does the server remember that I’m authenticated after login?”

Right now:
- You log in
- Server says “Login successful”
- Next request → server forgets you completely

So authentication is stateless and temporary.

That’s where JWT (or sessions or another mechanism) come in.

After login, the server must answer: “How do I recognize this user again on the next request?”

Possible answers:
- Cookies + sessions
- JWT
- OAuth tokens
- API keys

So JWT is just one memory mechanism.

Imp. Clarification:
JWT does NOT authenticate by itself
JWT just remembers the result of authentication.

We are writing all this cuz' we are gonna use JWT in our project.

4️⃣ Very important separation (engineers get this wrong)

Concept	                    What it means

Authentication	    -        Who are you?
Authorization	    -        What are you allowed to do?
Protection	        -        Blocking access to routes

Right now:
We have authentication

We do NOT have:
- Authorization
- Route protection
- Ownership checks

Those come later.

5️⃣ 👉 Why does the server forget the user after login in your current implementation?

The server forgets the user after login because HTTP is stateless(This means every request made by client is independent of other 
requests) and the client does not send any identity proof (like a token or session id) with subsequent requests, so the server 
has no way to recognize the user again.

After login, we are not giving the client anything like:

- a token
- a session ID
- a cookie
- any identifier at all

So next time the client makes a request:
GET /api/tasks

The server sees:
“Who are you? I have no idea.”

How JWT fixes exactly this (one line preview)
JWT solves this by:

- Giving the client a token after login
- The client sends this token on every request
- The server verifies it and knows who the user is

No memory needed on the server.
*/