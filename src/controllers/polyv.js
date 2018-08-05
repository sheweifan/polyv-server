const config = require('../config')
const axios = require('axios')
const crypto = require('crypto')
const qs = require('querystring')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const apis = {
  token: 'https://hls.videocc.net/service/v1/token'
}

exports.sign = async ctx => {
  const { id } = ctx.query
  const userId = config.userid
  const secretkey = config.secretkey
  const videoId = id
  const ts = new Date().getTime()
  const viewerIp = ctx.request.header['x-real-ip'] // ctx.request.ip
  const viewerId = 1
  const viewerName = 'sheweifan'
  const extraParams = 'HTML5'

  /* 将参数 $userId、$secretkey、$videoId、$ts、$viewerIp、$viewerIp、$viewerId、$viewerName、$extraParams
      按照ASCKII升序 key + value + key + value ... +value 拼接
  */
  const concated = `extraParams${extraParams}`
  + `ts${ts}`
  + `userId${userId}`
  + `videoId${videoId}`
  + `viewerId${viewerId}`
  + `viewerIp${viewerIp}`
  + `viewerName${viewerName}`

  // 再首尾加上 secretkey
  const plain = `${secretkey}${concated}${secretkey}`

  // 取大写MD5
  const sign = md5(plain).toLocaleUpperCase()

  const postData = qs.stringify({
    userId, videoId, ts, viewerIp, viewerName, extraParams, viewerId, sign
  })
  console.log(postData)

  try {
    const res = await axios({
      url: apis.token,
      method: 'POST',
      data: postData,
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
    ctx.body = res.data
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 0
    }
  }


  // this.body = {
  //   sign
  // }
}
