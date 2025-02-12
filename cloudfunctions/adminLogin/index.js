// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

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

    const { adminPassword } = event

    if (!adminPassword) {
        return { code: 400, message: '管理员密码未提供' }
    }

    // 检查是否为管理员
    const adminRes = await db.collection('admin').where({ openid }).get();
    if (adminRes.data.length === 0) {
        return { code: 403, message: '用户不是管理员' }
    }

    const admin = adminRes.data[0]

    if (admin.password !== adminPassword) {
        return { code: 403, message: '管理员密码错误' }
    }

    await db.collection('admin').where({ openid }).update({
        data: {
            count: _.inc(1),
            time: new Date().getTime()
        }
    })

    return {
        code: 200,
        message: '管理员登录成功'
    }
}