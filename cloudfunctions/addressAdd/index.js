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

  const { address, contactName, contactPhone, isDefault } = event

  // 获取用户信息
  const user = await db.collection('users').where({ openid }).get();
  if (user.data.length === 0) {
    return { code: 404, message: '用户未注册' }
  }

  const addressList = user.data[0].addresses || []

  // 检查是否超过限制
  if (addressList.length >= 3) {
    return { code: 400, message: '最多只能添加三个地址' }
  }

  // 新地址
  const newAddress = {
    id: Date.now().toString(), // 唯一标识符
    address,
    contactName,
    contactPhone,
    isDefault: addressList.length === 0 || isDefault, // 第一个地址或显式设为默认
  }

  // 更新数据库
  if (newAddress.isDefault) {
    // 只有当地址列表不为空时才取消原默认地址
    if (addressList.length > 0) {
      addressList.forEach(addr => addr.isDefault = false);
    }
  }
  addressList.push(newAddress)

  await db.collection('users').where({ openid }).update({
    data: { addresses: addressList },
  })

  return {
    code: 200,
    message: '地址添加成功',
    data: newAddress
  }

}