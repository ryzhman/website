// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('@babel/register')({
    presets: [ '@babel/env' ]
})

require('dotenv').config()
const express = require("express")
const routes = require('./routes/')
//validation
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')

//repo
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')

const cors = require('cors')
const helmet = require('helmet')

const app = express()
const router = express.Router()
const mongoDbURL = process.env.MONGODB_URI

/** configure cloudinary */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

/** connect to MongoDB datastore */
try {
    mongoose.connect(mongoDbURL, {
        //useMongoClient: true
    })
} catch (error) {

}
let port = process.env.PORT || 5000

/** set up middlewares */
app.use(cors())
//parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded if required
// app.use(bodyParser.urlencoded({ extended: false }))

app.use(helmet())
app.use(expressValidator())
//app.use('/static',express.static(path.join(__dirname,'static')))

/** set up routes {API Endpoints} */
routes(router)

app.use('/api', router)

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});