// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    // const wxContext = cloud.getWXContext()
    // const openid = wxContext.OPENID

    // if (openid !== event.openid) {
    //     return {
    //         code: 403,
    //         message: 'openid不一致'
    //     }
    // }

    try {
        const { is_verified, page = 1, pageSize = 10 } = event
        // 查询指定状态的用户列表
        const res = await db.collection('users')
            .where({
                is_verified // 根据状态过滤
            })
            .skip((page - 1) * pageSize) // 分页偏移
            .limit(pageSize) // 每页条数
            .get()

        // 获取总条数
        const countRes = await db.collection('users')
            .where({
                is_verified
            })
            .count()

        return {
            code: 200,
            data: res.data,
            total: countRes.total, // 总条数
            currentPage: page
        }
    }
    catch {
        return {
            code: 400
        }
    }
}