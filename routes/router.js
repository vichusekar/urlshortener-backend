const express = require('express')
const nodemailer = require('nodemailer')
const { URLModel } = require('../model/urlModel')
// const { v1: uuidv1 } = require('uuid')
// const {nanoid} = require('nanoid')
const router = express.Router()
const { UserModel } = require('../model/UserModel')
const { hashPassword, createToken, comparePassword } = require('../authentication/auth')
const JWT_EXPIRE = process.env.JWT_EXPIRE
const JWT_SK = process.env.JWT_SK
const { validateUrl } = require('../model/urlModel')


// router.post('/shorten/:_id', async (req, res) => {

//     const origUrl = req.body
//     const BASE = process.env.BASE

//     const urlId = uuidv1(8)

//     try {
//         let url = await URLModel.findOne({ origUrl: req.body.origUrl })
//         if (url) {
//             res.status(200).send({ message: "Data fetched successfully",url })
//         }
//         else {
//             let shortUrl = `${BASE}/${origUrl}/${urlId}`
//             url = new URLModel({
//                 urlId,
//                 origUrl,
//                 shortUrl
//             })

//             await url.save()
//             res.status(200).send({ message: "URL Shortened Successfully", url })

//         }

//     } catch (error) {
//         res.status(500).send({ message: "Internal Server Error", error: error?.message })
//     }

// })

// const { nanoid } = require('nanoid');
// function generateShortURL() {
//   return 'http://example.com/' + nanoid(8); // You can adjust the length as needed
// }
// const shortURL1 = generateShortURL();
// const shortURL2 = generateShortURL();
// console.log('Short URL 1:', shortURL1);
// console.log('Short URL 2:', shortURL2);

router.post('/shorten', async (req, res) => {

    const { nanoid } = await import('nanoid')
    const { origUrl } = req.body
    const urlId = nanoid()
    const base = process.env.BASE

    if (validateUrl(origUrl)) {
        try {
            let url = await URLModel.findOne({ origUrl })
            if (url) {
                res.status(200).send({ message: 'URL Fetched Successfully' })
            }
            else {
                const shortUrl = `${base}/${urlId}`

                url = new URLModel({
                    origUrl,
                    shortUrl,
                    urlId
                })
                await url.save()
                res.status(200).send({ message: 'URL Shortened Successfully' })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Internal Server Error', error: error?.message })
        }
    }
})

router.post('/signup', async (req, res) => {
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (user) {
            res.status(500).send({ message: `User with ${req.body.email} already exists` })
        }
        else {
            req.body.password = await hashPassword(req.body.password)
            let user = await UserModel.create(req.body)
            user.save()
            res.status(200).send({ message: "Signup Successfully" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error", error: error?.message })
    }
})

router.post('/sign-in', async (req, res) => {
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (user) {
            if (await comparePassword(req.body.password, user.password)) {
                let token = await createToken(user)
                res.status(200).send({ message: 'Login Successfully', token })
            }
            else {
                res.status(500).send({ message: "Invalid Credential" })
            }
        }
        else {
            res.status(500).send({ message: `User with ${req.body.email} doesn't exists` })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal Server Error', error: error?.message })
    }
})

router.post('/forgot-password/:id', async (req, res) => {
    try {
        const oldUser = await UserModel.findOne({ email: req.body.email })
        if (oldUser) {
            const resetlink = `http://localhost:3000/reset-password/${oldUser._id}`

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'rajasekarvignesh093@gmail.com',
                    pass: 'xacc elgo llit itnq'
                }
            });

            var mailOptions = {
                from: 'vigneshmsho093@gmail.com',
                to: req.body.email,
                subject: 'Reset your password ',
                text: resetlink,

            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.status(200).send({ message: 'Email sent successfully' })

        }

        else {
            res.status(400).send({ message: `User with ${req.body.email} doesn't exists`, error: error?.message })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal Server Error', error: error?.message })

    }
})

router.post('/reset-password/:id', async (req, res) => {
    try {
        let oldUser = await UserModel.findOne({ email: req.body.email })

        if (oldUser) {
            oldUser.password = await hashPassword(req.body.password)
            let token = await createToken(oldUser)
            oldUser.save()
            res.status(200).send({ message: 'Password Changed Successfully', token })
        }
        else {
            res.status(400).send({ message: `User with ${req.body.email} not exists` })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error?.message })
    }
})


// router.get('/:urlId', async (req, res) => {
//     try {
//         const url = await URLModel.findOne({ urlId: req.params.urlId })

//         if (url) {
//             // await url.updateOne({urlId: req.params.urlId})
//             // res.redirect(URLModel.origUrl)
//             let shorturl = await URLModel.findOne({ urlId: req.params.urlId })
//             res.status(200).send({ message: 'URL Fetched Successfully', shorturl })
//         }
//         else {
//             res.status(400).send({ message: 'URL not found' })
//         }
//     } catch (error) {
//         res.status(500).send({ message: 'Internal Server Error', error: error?.message })
//     }
// })

module.exports = router

