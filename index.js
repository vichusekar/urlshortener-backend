const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

app.use(cors())
app.use(express.json())

const linkRouter = require('./routes/router')
const getlink = require('./routes/index')

const DB_NAME = 'url_shortener'

const PORT = process.env.PORT

app.use('/', linkRouter)
app.use('/', getlink)

app.get('/', (req,res) => {
  res.send("<h1>URL Shortener</h1>")
})

const connection_url =
  `mongodb+srv://root:888333@cluster0.zfpvnmb.mongodb.net/${DB_NAME}`;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.listen(PORT, ()=>console.log(`App running port in ${PORT}`))