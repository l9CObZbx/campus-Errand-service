// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const res = await db.collection('inform')
            .orderBy('priority', 'desc')
            .orderBy('expected_time', 'desc')
            .get()
        return {
            code: 200,
            result: res.data
        }
    }
    catch (err) {
        return {
            code: 400
        }
    }
}