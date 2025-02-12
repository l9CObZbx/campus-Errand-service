// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

    const { _id, type, index } = event

    try {
        if (type === 'status') {
            await db.collection('orders')
                .where({ _id })
                .update({
                    data: {
                        order_status: index
                    }
                })
            return {
                code: 200,
                message: 'success'
            }
        }

        if (type === 'priority') {
            await db.collection('orders')
                .where({ _id })
                .update({
                    data: {
                        priority: index
                    }
                })
            return {
                code: 200,
                message: 'success'
            }
        }
    }
    catch (err) {
        return {
            code: 400,
            message: err
        }
    }

}