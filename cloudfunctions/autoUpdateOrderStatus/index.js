// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        // 找到所有未接单，并且超时订单
        const result = await db.collection('orders')
            .where({
                expected_time: _.lt(new Date()),  // 筛选预期时间小于当前时间
                order_status: '0' // 未接单
            })
            .update({
                data: {
                    order_status: '3',              // 更新状态
                    updated_time: db.serverDate()    // 更新时间
                }
            }).get()


        return { success: true, updatedCount: result.stats.updated };
    } catch (err) {
        console.error('更新失败', err);
        return { success: false, error: err };
    }
}