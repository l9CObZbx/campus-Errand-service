// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const res = await db.collection('orders')
            .where({
                order_status: '0',
                expected_time: _.gt(new Date().getTime())
            })
            .count()

        return {
            code: 200,
            result: res
        }
    }
    catch {
        return {
            code: 400,
            message: 'orederUnreceiveCount'
        }
    }
}