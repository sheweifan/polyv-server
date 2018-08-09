const config = require('../config')
const axios = require('axios')
const crypto = require('crypto')
const qs = require('querystring')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const apis = {
  token: 'https://hls.videocc.net/service/v1/token'
}

exports.token = async ctx => {
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
    const {
      data, code
    } = res.data
    if (code === 200) {
      ctx.body = {
        code: 0,
        data: {
          token: data.token
        }
      }
    } else {
      throw new Error('第三方签名失败')
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 1
    }
  }

}

exports.sign = async ctx => {
  const { id } = ctx.query
  const secretkey = config.secretkey
  const ts = new Date().getTime()
  const sign = md5(secretkey + id + ts)
  ctx.body = {
    success: true,
    code: 0,
    data: {
      ts, sign
    }
  }
}
