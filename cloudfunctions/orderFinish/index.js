// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const { query } = event

        await db.collection('orders')
            .where(query)
            .update({
                data: {
                    order_status: '2',
                    updated_time: new Date().getTime(),
                    completed_time: new Date().getTime()
                }
            })
        return {
            code: 200,
            message: 'success'
        }
    }
    catch (err) {
        return {
            code: 400,
            message: err
        }
    }

}