// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const { query } = event
        const res = await db.collection('orders')
            .where(query)
            .get()

        return {
            code: 200,
            result: res
        }
    }
    catch {
        return {
            code: 400,
            message: 'sth has been worry'
        }
    }
}