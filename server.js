const app = require('./app') // Here we are doing this cuz' we need to separate routes logic and starting the server(i.e. app.listen(...) part) 
const connectDB = require('./config/db')

const port = 3000;

connectDB()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
