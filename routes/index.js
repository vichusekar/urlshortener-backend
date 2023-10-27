const express = require('express');
const { URLModel } = require('../model/urlModel')
const router = express.Router();

// router.get('/:urlId', async (req, res) => {
//   try {
//     const url = await URLModel.findOne({ urlId: req.params.urlId });
//     if (url) {
//       await URLModel.updateOne(
//         {
//           urlId: req.params.urlId,
//         },
//         { $inc: { clicks: 1 } }
//       );
//       res.status(200).redirect(url.origUrl)
//       // return res.status(200).redirect(url.origUrl)
//     } else res.status(404).json('Not found');
//   } catch (err) {
//     console.log(err);
//     res.status(500).json('Server Error');
//   }
// });

router.get('/all', async (req, res) => {
  try {
    let url = await URLModel.find({})
    res.status(200).send({ message: 'Data Fetched Successfully', url })
  } catch (error) {
    res.status(400).send({ message: 'Internal Server Error', error: error?.message })
  }
})

// router.get('/:shortUrl', async (req, res) => {
//   try {
//     let url = await URLModel.findOne({ urlId: req.params.urlId });
//     if (url) {
//       await URLModel.updateOne(
//         {
//           urlId: req.params.urlId,
//         },
//         { $inc: { clicks: 1 } }
//       );
//       res.status(200).redirect(url.origUrl)
//     }else {
//       res.status(404).send({message: "Not found URL"})
//     }
//   } catch (error) {
//     console.log(error)
//     res.status(400).send({ message: 'Internal Server Error', error: error?.message })
//   }
// })

router.get('/:urlId', async (req, res) => {
  try {
    const url = await URLModel.findOne({urlId: req.params.urlId});
    if (url) {
      await URLModel.updateOne(
        {
          urlId: req.params.urlId,
        },
        { $inc: { clicks: 1 } }
      );
      res.status(200).redirect(url.origUrl)
      // return res.status(200).redirect(url.origUrl)
    }
    else {
      res.status(404).send({ message: 'nothing there' })
    }
  } catch (error) {
    res.status(500).send({ message: 'inter error', error: error?.message })
  }
})

module.exports = router;