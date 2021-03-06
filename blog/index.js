require("dotenv").config()
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/notes')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info("connected to db");
  })
  .catch((err) => {
    logger.error("Error connecting to db", err.message);
  });

app.use(cors())
app.use(express.json())
app.use("/api/blogs", blogsRouter)


const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})