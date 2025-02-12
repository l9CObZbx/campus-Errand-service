// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const { query = {}, field, listType, page = 1, pageSize = 10 } = event

    try {
        if (listType === 'hall') {
            query.expected_time = _.gt(new Date().getTime())

            const result = await db.collection('orders')
                .where(query)
                .skip((page - 1) * pageSize) // 分页偏移
                .limit(pageSize) // 每页条数
                .field(field)
                .orderBy('priority', 'desc')
                .orderBy('expected_time', 'asc')
                .get()

            const countRes = await db.collection('orders')
                .where(query)
                .count()

            return {
                code: 200,
                message: 'success',
                total: countRes.total,
                result
            }
        }

        if (listType === 'deliver') {
            query.order_status = _.in['1', '2']
            const result = await db.collection('orders')
                .where(query)
                .skip((page - 1) * pageSize) // 分页偏移
                .limit(pageSize) // 每页条数
                .field(field)
                .orderBy('order_status', 'asc')
                .orderBy('expected_time', 'asc')
                .get()

            const countRes = await db.collection('orders')
                .where(query)
                .count()

            return {
                code: 200,
                message: 'success',
                total: countRes.total,
                result
            }
        }

        if (listType === 'my') {
            const result = await db.collection('orders')
                .where(query)
                .skip((page - 1) * pageSize) // 分页偏移
                .limit(pageSize) // 每页条数
                .field(field)
                .orderBy('order_status', 'asc')
                .orderBy('expected_time', 'asc')
                .get()

            const countRes = await db.collection('orders')
                .where(query)
                .count()

            return {
                code: 200,
                message: 'success',
                total: countRes.total,
                result
            }
        }

        if (listType === 'admin') {
            const result = await db.collection('orders')
                .where(query)
                .skip((page - 1) * pageSize) // 分页偏移
                .limit(pageSize) // 每页条数
                .field(field)
                .orderBy('order_status', 'asc')
                .orderBy('expected_time', 'asc')
                .get()

            const countRes = await db.collection('orders')
                .where(query)
                .count()

            return {
                code: 200,
                message: 'success',
                total: countRes.total,
                result
            }
        }


    }
    catch {
        return {
            code: 400,
            message: 'error',
        }
    }
}