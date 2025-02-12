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

  const { id } = event

  const user = await db.collection('users').where({ openid }).get()
  if (user.data.length === 0) {
    return { code: 404, message: '用户未注册' }
  }

  const addressList = user.data[0].addresses || []
  const targetIndex = addressList.findIndex(addr => addr.id === id)
  if (targetIndex === -1) {
    return { code: 404, message: '地址未找到' }
  }

  // 删除地址
  const removed = addressList.splice(targetIndex, 1)[0]

  // 如果删除的是默认地址，设置第一个地址为默认
  if (removed.isDefault && addressList.length > 0) {
    addressList[0].isDefault = true;
  }

  await db.collection('users').where({ openid }).update({
    data: { addresses: addressList },
  });

  return { code: 200, message: '地址删除成功' };
}