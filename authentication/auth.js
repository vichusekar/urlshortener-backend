const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRound = 10;

let hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

let comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}


let createToken = async ({ email, role, name, _id }) => {
    let token = await jwt.sign(
        { email, role, name, id: _id },
        process.env.JWT_SK,
        { expiresIn: process.env.JWT_EXPIRE }
    )
    return token
}
let decodeToken = async (token) => {//decaoding the jwt
    return jwt.decode(token)
}

module.exports = { createToken, hashPassword, comparePassword }