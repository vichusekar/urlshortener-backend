const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name: {type: String, required: true},

    email: {type: String, required: true},

    password: {type: String, required: true}

}, {collection:'users', versionKey: false})

// const passwordSchema = new mongoose.Schema({
//     password: {type: String, required: true}
// })

let UserModel = mongoose.model('users', UserSchema)
// let passwordModel = mongoose.model('users', passwordSchema)

module.exports = {UserModel}