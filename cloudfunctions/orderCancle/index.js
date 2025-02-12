// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

    const { query } = event

    try {
        await db.collection('orders')
            .where(query)
            .update({
                data: {
                    order_status: '3',
                    updated_time: db.serverDate()
                }
            })
        return {
            code: 200
        }
    }

    catch (err) {
        return {
            code: 400,
            err
        }
    }

}