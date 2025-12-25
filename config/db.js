const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB Connected Successfuly: ${conn.connection.host}`)
    }
    catch(error){
        console.log("DB Connection Failed:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB // If we write: "module.exports = connectDB()", the function will directly be executed in this file and 
                           // 'undefined'(cuz connectDB() returns nothing) will be exported instead of the function which we don't 
                           // want to happen.

/*
Now while making practice programs we used to connect mongodb in the entry file(index.js) itself but here we have separated that 
logic in a separate file(db.js in 'config' folder). This is a standard practice in real world projects, it has various benefits:
separation of concerns, Centralized Connection Management, Improved Testability, etc.

This file’s only job:
- Connect to MongoDB
- Log success or failure
- Export the function (and we import it in server.js and call the function from there only).

WE NEED TO MAKE THIS ALSO A COMMON PRACTICE FOR FUTURE.
*/

/*
SOME USEFUL CONCEPTS USED ABOVE:-

🔑 Summary (Simple Words)

Code                	        Meaning

conn	                        Mongoose connection object
conn.connection.host	        MongoDB hostname (localhost)
error.message	                Short readable error description
process.exit(1)	                Kill the server due to error

BELOW ARE THE DETAILS:- 

1️⃣ conn.connection.host:-

what's conn? 
const conn = await mongoose.connect('mongodb://localhost:27017/taskify')

- mongoose.connect() returns a connection object
- You stored that returned object in conn
So:
conn  // = Mongoose connection instance

What is conn.connection?
Inside that object, there is a connection property that contains low-level connection details.

Think like this:
conn
 └── connection
      ├── host
      ├── port
      ├── name (DB name)
      └── other metadata

What is conn.connection.host?
It gives the hostname of MongoDB
In your case, it will print:
localhost

This is helpful in confirmation and debugging.


2️⃣ error.message
What is error?
catch(error) {
....
}
When something goes wrong in try, Node automatically creates an Error object
That object is passed into catch(error)

What is inside an Error object?

An Error object looks like:

{
  name: 'MongoNetworkError',
  message: 'connect ECONNREFUSED 127.0.0.1:27017',
  stack: '...'
}

What does error.message give?
Just the human-readable explanation.

This is also helpful for logs and debugging.


3️⃣ process.exit(1)
This is very important in backend apps.

What is process?
- process is a global Node.js object
- It represents the current running Node application

What does process.exit() do?
process.exit(code): Immediately stops the Node.js process, No more code runs after this.

Why 1?
Exit codes have meaning:

Code    	Meaning
0	        Success (normal exit)
1	        Failure / error

So:
process.exit(1)

Means:
❌ Exit the app because something went wrong

Why is it used here?

If DB connection fails:
- Your backend cannot work
- Running the server without DB is pointless
- So you force the app to stop

This prevents bugs like:
- APIs running but DB queries failing
- Silent failures

✔ This is Professional backend practice
*/