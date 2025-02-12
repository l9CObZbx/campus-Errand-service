// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const { openid, order_id } = event

    const wxContext = cloud.getWXContext()
    if (wxContext.OPENID !== event.openid) {
        return {
            code: 403,
            message: 'openid不一致'
        }
    }

    await db.collection('orders')
        .where({
            _id: order_id
        })
        .update({
            data: {
                order_status: '1',
                use_receive: openid,
                updated_time: new Date().getTime(), // 订单更新时间
            }
        })

    // 调用 sendNotification 云函数
    const notificationResult = await cloud.callFunction({
        name: 'sendNotification', // 云函数名称
        data: {
            order_id
        } // 传递的参数
    });



    return {
        code: 200,
        message: '接单成功',
        notificationResult
    }



}