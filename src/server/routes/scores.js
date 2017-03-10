const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json({
      'Levente': 100000000,
      'Rita': 10
  })
})

module.exports = router
