// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const {
            user_pay,
            use_receive = null,
            user_pay_info,
            expected_time,
            order_type,
            requires_off_campus,
            price,
            pickup_location,
            order_brief,
            oreder_noted = null,
            fileList = [],
            order_status = '0',
            created_time = new Date().getTime(), // 订单创建时间,
            updated_time = null,
            completed_time = null,
            cancellation_reason = null,
            priority = 0
        } = event

        // 插入数据到数据库
        await db.collection('orders').add({
            data: {
                user_pay,
                use_receive,
                user_pay_info,
                expected_time: expected_time,
                order_type,
                requires_off_campus,
                price,
                pickup_location,
                order_brief,
                oreder_noted,
                fileList,
                order_status,
                created_time,
                updated_time,
                completed_time,
                cancellation_reason,
                priority
            },
        });

        return {
            code: 200,
            message: '订单创建成功'
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            code: 500,
            message: '订单创建失败',
            error: error.message,
        };
    }
}