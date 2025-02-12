// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 默认头像fileID
const avatarFileID = 'cloud://ilyaa-9gnyr33g2884e8ee.696c-ilyaa-9gnyr33g2884e8ee-1329892735/resource/avatar/avatar.png'
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

  // 数据收集
  const { fileID, nickname } = event
  const updateData = {}
  if (fileID) {
    updateData.avatarFileID = fileID
  }
  if (nickname) {
    updateData.nickname = nickname
  }

  if (Object.keys(updateData).length === 0) {
    return {
      code: 400,
      message: '参数不足'
    }
  }

  // 先判断用户是否是默认头像
  if (fileID) {
    const { data } = await db.collection('users').where({
      openid
    }).field({
      avatarFileID: true
    }).get()
    if (data[0].avatarFileID !== avatarFileID) {
      cloud.deleteFile({
        fileList: [data[0].avatarFileID]
      })
    }
  }




  await db.collection('users').where({
    openid
  }).update({
    data: updateData
  })



  return {
    code: 200,
    message: '成功'
  }

}