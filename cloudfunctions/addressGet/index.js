// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (openid !== event.openid) {
    return {
      code: 403,
      message: 'openid不一致'
    }
  }

  const user = await db.collection('users').where({ openid }).get()
  if (user.data.length === 0) {
    return { code: 404, message: '用户未注册' }
  }

  const addressList = user.data[0].addresses || [];
  return {
    code: 200,
    message: '地址获取成功',
    data: addressList
  };
}