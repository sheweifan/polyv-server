const { token } = require('../controllers/polyv')

module.exports = router => {
  router.get('/polyv/token', token)
}
