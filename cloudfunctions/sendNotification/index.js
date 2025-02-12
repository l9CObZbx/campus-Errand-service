// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const { order_id } = event;

    function formatTimestamp(ts) {
        const BEIJING_OFFSET = 8 * 60 * 60 * 1000; // 北京时间偏移量
        const date = new Date(ts + BEIJING_OFFSET); // 调整时间戳为北京时间
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要 +1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    try {

        // 从数据库中查询订单信息，获取下单者的 openid
        const order = await db.collection('orders').doc(order_id).get();

        const {
            pickup_location, price, updated_time, order_status, user_pay
        } = order.data

        if (!user_pay) {
            throw new Error('订单中未找到下单者 openid');
        }

        const statusMap = {
            '1': '已接单',
            '2': '已完成',
            '3': '已取消'
        }

        // 调用微信订阅消息 API
        const result = await cloud.openapi.subscribeMessage.send({
            touser: user_pay, // 接收者 openid
            templateId: 'BFbV_nZieKunL0nz6mHU1AEcpjG9PoRJcI7n1P7BL9M', // 替换为订阅消息模板 ID
            page: `pages/order/detail/detail?order_id=${order_id}&detailType=my`, // 跳转页面
            data: {
                thing9: { value: pickup_location }, // 对应订单内容
                amount4: { value: price }, // 对应订单金额
                time32: { value: formatTimestamp(updated_time) },  // 对应更新时间
                phrase3: { value: statusMap[order_status] } // 对应订单状态
            }
        });

        console.log('订阅消息发送成功', result);
        return { success: true };
    } catch (error) {
        console.error('订阅消息发送失败', error);
        return { success: false, error: error.message };
    }
}