const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader)
    {return res.status(401).send("NO TOKEN PROVIDED")}
    if(!authHeader.startsWith("Bearer "))
    {return res.status(401).send("Invalid Header Format")}
    const token = authHeader.slice(7)
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.userId
        console.log(req.user)
        next()
    }
    catch(error){
        return res.status(401).send("Invalid or expired token")
    }
}

module.exports = authMiddleware