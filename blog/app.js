require("dotenv").config()
const logger = require('./utils/logger')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const blogsRouter = require('./controllers/notes')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/user')
const mongoUrl = config.MONGODB_URI;
const middleware = require('./utils/middleware')
mongoose
    .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        logger.info("connected to db");
    })
    .catch((err) => {
        logger.error("Error connecting to db", err.message);
    });



app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use("/api/users", usersRouter)
app.use("/api/blogs", blogsRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing');
    app.use('/api/testing', testingRouter);
 }


module.exports = app
