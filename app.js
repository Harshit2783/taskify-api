const express = require("express");
const taskRouter = require('./routes/taskRoutes')
const authRouter = require('./routes/authRoutes')
const errorHandler = require('./middlewares/errorMiddleware')

const app = express();

// middlewares
app.use(express.json()); // For parsing incoming json data.
app.use('/api/tasks', taskRouter)
app.use('/api/auth', authRouter)

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Central error-handling middleware (must be registered after all routes)
app.use(errorHandler)

module.exports = app;

/*
Imp. Note: Now while making practice programs, we didn't made two separate files(app.js and server.js), we only had one and it 
contained the whole 'basic express server code'(the one which we used to copy from express js documentation), and that single file 
had two responsibilities: 1. Creating the Express app and 2. Starting the server (app.listen()). That’s fine for learning, but for 
real projects we split responsibilities.
That's what we are doing here in this project.

The core idea (remember this):-
app.js = WHAT the server does [Creates the Express app, Configures middleware, Defines routes, Exports the app all this in one module].
server.js = STARTS the server [Imports the app, Calls listen(), Handles environment-specific startup logic, etc].

So:
- app.js never listens on a port
- server.js never defines routes

Why we do this (important for later):-
- This separation helps when you add:
- MongoDB connection
- Environment variables
- Testing
- Error handling
- Scaling

WE NEED TO MAKE THIS A COMMON PRACTICE FOR FUTURE.
*/