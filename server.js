const express = require('express')
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')

const userRoutes = require ('./Routes/userRoutes')
const orderRoutes = require ('./Routes/orderRoutes')

const db = require('./db')
const cors = require('cors');

//setting up your port
const PORT = process.env.ServerPORT || 5000

//assigning the variable app to express
const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: 'https://tools-project-2425-mo-emad-dev.apps.rm3.7wse.p1.openshiftapps.com', // Replace if port somehow changes
    credentials: true // for cookies
}))

//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ alter:true }).then(() => {
    console.log("db has been re sync")
})

app.get('/api/test', (req, res) => {
    res.status(200).json({
      message: 'Backend is up and running!',
      success: true,
    });
  });

//routes for the user API
app.use('/api/users', userRoutes)

app.use('/api', orderRoutes);

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))