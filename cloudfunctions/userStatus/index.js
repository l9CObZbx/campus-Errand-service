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

    const { data } = await db.collection('users').where({ openid }).field({
        status: true,
        is_verified: true,
        certifications: true
    }).get()

    return {
        code: 200,
        data
    }
}