require('dotenv').config()

const PORT = process.env.PORT
const JWT_SECRET = process.env
const SECRET = process.env
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  SECRET
}