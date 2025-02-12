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

    // 1. 获取 users 表中的用户总数
    const userCountPromise = db.collection('users').count()

    // 2. 获取 users 表中 is_verified 为 2 的用户总数
    const verifiedUserCountPromise = db.collection('users').where({
        is_verified: 2,
    }).count()

    const orderCountPromise = db.collection('orders').count()

    // 3. 获取 admin 表中对应管理员的信息
    const adminInfoPromise = db.collection('admin').where({ openid }).field({
        count: true,
        time: true
    }).get()

    // 使用 Promise.all 并行获取数据
    const [userCountResult, verifiedUserCountResult, adminInfoResult, orderCountResult] = await Promise.all([
        userCountPromise,
        verifiedUserCountPromise,
        adminInfoPromise,
        orderCountPromise
    ])

    // 返回结果
    return {
        code: 200,
        data: {
            totalUsers: userCountResult.total, // 用户总数
            verifiedUsers: verifiedUserCountResult.total, // is_verified 为 2 的用户数
            admin: adminInfoResult.data, // 管理员信息，包括 count 和 time
            orderCount: orderCountResult.total
        },
    };
}