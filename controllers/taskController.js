// Below We have explained the concepts used in this code so read them before if u have any problem in understanding then read the code.
// I have made some changes in this file later in stage 6.
const Task = require('../models/Task')

const getTasks = async (req, res)=>{ // For Read operation
    try {
        const tasks = await Task.find({user: req.user})
        res.status(200).json(tasks) 
    }
    catch(error) {
        res.status(500).json({"Error": error.message})
    }
};

const createTask = async (req, res)=>{ // For Create Operation
    try{
        const task =await Task.create({ // We are gonna send this req.body content from Postman.
            ...req.body,     
            user: req.user
        }) 
        res.status(201).json(task)
    }
    catch(error) {
        res.status(500).json({"Error": error.message})
    }
}

const updateTask = async (req, res)=>{ // For Update Operation
    try{ 
        const task1 = await Task.findById(req.params.id)
        if(!task1)
        {
            res.status(404).send("Task not found")
        }
        else 
        {
            if(task1.user.toString() == req.user)
            {
                if(req.body.user)
                {delete req.body.user}
                const task2 = await Task.findOneAndUpdate({_id: task1._id}, req.body, {new: true}) // {new: true} doesn't work with updateOne() and updateMany().
                res.status(200).json(task2)
            }
            else
            {res.status(403).send("You don't have permission for this action")}
        }
    }
    catch(error) {
        res.status(500).json({"Error": error.message})
    }
}

const deleteTask = async (req, res)=>{ // For Delete operation
    try{
        const task = await Task.findById(req.params.id)
        if(!task)
        {
            res.status(404).send("Task not found")
        }
        else 
        {
            if(task.user.toString() == req.user)
            {
                await Task.deleteOne({_id: task._id})
                res.status(200).send("Task deleted successfully")
            }
            else
            {res.status(403).send("You don't have permission for this action")}
        }
    }
    catch(error) {
        res.status(500).json({"Error": error.message})
    }
}
module.exports = { getTasks, createTask, updateTask, deleteTask } /* I thought this is not valid syntax for writing JS objects but 
actually it's the shorthand syntax for writing {getTasks: getTasks, createTask: createTask ...} and it's perfectly valid. The 
shorthand works when the "key" name and "variable" name are the same. It can be used for functions, variables, objects, etc. 
See below for more details.*/


/*
1️⃣ What are “controllers”:-
Before using controllers, our code looked like this:

Route  →  logic written directly inside route

Example:

router.get('/', (req, res) => {
    res.send("Hello world get")
})

This is fine for tiny apps, but not scalable.

Controllers simply mean: 👉 Move the logic OUT of routes

So instead of:
router.get('/', (req, res) => { ... })

We do:
router.get('/', getTasks)
Where getTasks lives in a controller file.

Mental model (very important)

Routes      → decide WHAT endpoint exists
Controllers → decide WHAT HAPPENS when endpoint is hit
Models      → talk to database

So the flow becomes:
Client → Route → Controller → Model → DB

Simple Definition: A controller is Just a Function that:
- Receives req and res
- Contains the logic
- Talks to the model
- Sends a response

That’s it. Nothing new.

2️⃣ HTTP status codes:-
- HTTP status codes are three-digit numbers sent by a web server to a client (like a browser) to indicate the result of a request, 
signaling success, failure, or the need for further action.
- They are crucial for debugging, improving user experience, and SEO, with famous examples including 200 OK for success and 
404 Not Found for missing resources. 

Categories of HTTP Status Codes:-
- 1xx (Informational): Request received, continuing process (e.g., 100 Continue).
- 2xx (Success): The action was successfully received, understood, and accepted (e.g., 200 OK, 201 Created).
- 3xx (Redirection): Further action is needed by the client to complete the request (e.g., 301 Moved Permanently, 302 Found).
- 4xx (Client Error): The request contains bad syntax or cannot be fulfilled (e.g., 404 Not Found, 403 Forbidden).
- 5xx (Server Error): The server failed to fulfill an apparently valid request (e.g., 500 Internal Server Error, 503 Service Unavailable). 

Common Examples:-
- 200 OK: The standard successful response; the request worked.
- 201 Created: The client's request has been successfully fulfilled and has resulted in the creation of one or more new resources on the server. 
- 204 No Content: The server successfully processed the request but isn't returning any content.
- 301 Moved Permanently: The requested resource has permanently moved to a new URL.
- 400 Bad Request: The server couldn't understand the request due to client error.
- 404 Not Found: The server can't find the requested resource.
- 500 Internal Server Error: A generic error message when the server encounters an unexpected condition. 

Imp. Note about res.status(code):-

- It Sets the HTTP response status code.
- But It does NOT send the response by itself
    → it just sets the code
    → res.json() actually sends it
That's why we see:-
res.status(200).json(...)
This is called method chaining(we have already covered this while learning JS).

WHY status codes matter (VERY IMPORTANT):-

Imagine frontend code:

if (response.status === 200) {
  showTasks()
} else {
  showError()
}

If you don’t set proper status codes:

- Frontend can’t distinguish success vs failure
- Debugging becomes painful
- API becomes unprofessional

3️⃣ HOW does data actually reach req.body?”
Currently there is no frontend or even ejs pages to send the data to backend.
so Right now, data gonna come from:
👉 API clients (Postman / Thunder Client / curl)
And we'll use POSTMAN.


How data flows (big picture)

Client (Postman / Frontend)
        ↓
HTTP Request (JSON body)
        ↓
Express Middleware (express.json(): this is written in app.js and it will parse incoming JSON data and put it into req.body).
        ↓
req.body
        ↓
Controller
        ↓
MongoDB
If ANY of these is missing → req.body is empty.


How YOU send data right now (Postman example)
Step-by-step (do this exactly)
- Open Postman
- Method: POST
- URL: http://localhost:3000/api/tasks
- Go to Body → raw → JSON
and Paste this:

{
  "title": "Workout",
  "description": "30 minutes cardio"
  "completed": false
}

- Click Send
- What Express receives internally:-

Express converts this JSON into:

req.body = {
  title: "Workout",
  description: "30 minutes cardio"
};

Now our controller can use it.

And Obviously similar logic and process for UPDATE also.

VERY IMP. -> Mental model (remember this forever):-

GET → URL params / query
POST → req.body
PUT/PATCH → req.body
DELETE → usually only req.params.id

4️⃣ Object property shorthand syntax(module.exports = { getTasks, createTask, updateTask, deleteTask }):-

Examples:

A.  const port = 3000;
    const env = "dev";

    module.exports = { port, env }; 
    This is equivalent to module.exports = { port:port, env:env };

B.  const config = { debug: true };
    module.exports = { config };

C.  const add = () => {};
    module.exports = { add };

The shorthand works only when: Key name == variable name
If names differ, shorthand cannot be used.

Note:-
But don't think module.exports can only export JS objects:-
module.exports = single_function OR number OR string OR class OR array OR null OR any JS value. 
❌ module.exports is NOT limited to objects
✅ It can export any JS value
✅ Objects are just the most practical pattern

5️⃣ Now apart from above concepts, we have only used basic error handling and basic CRUD operations via mongoose. We have already
discussed that no need to mug up such syntax just google it whenever needed.
*/