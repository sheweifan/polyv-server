const { token, sign } = require('../controllers/polyv')

module.exports = router => {
  router.get('/polyv/token', token)
  router.get('/polyv/sign', sign)
}
