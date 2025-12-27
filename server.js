require('dotenv').config() // This line must be at the top of server.js cuz' this line must be written before anything is imported(app, db, etc). This works cuz' dotenv.config() loads variables into process.env, process.env is global in Node.js, Once loaded, all files can access it using process.env.var_name.

const app = require('./app') // Here we are doing this cuz' we need to separate routes logic and starting the server(i.e. app.listen(...) part). 
const connectDB = require('./config/db')

const port = process.env.PORT || 3000; // We already know '||' in Javascript returns the FIRST TRUTHY VALUE when used like this.

connectDB()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
