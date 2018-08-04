const { sign } = require('../controllers/polyv')

module.exports = router => {
  router.get('/polyv/sign', sign)
}
