// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const {
        _id,
        user_pay_info,
        expected_time,
        order_type,
        requires_off_campus,
        price,
        pickup_location,
        order_brief,
        oreder_noted = null,
        fileList = [],
        oldFileList = []
    } = event

    try {

        // 删除原始图片
        if (oldFileList.length !== 0) {
            await cloud.deleteFile({
                fileList: oldFileList
            })
        }

        await db.collection('orders')
            .where({ _id })
            .update({
                data: {
                    user_pay_info,
                    expected_time,
                    order_type,
                    requires_off_campus,
                    price,
                    pickup_location,
                    order_brief,
                    oreder_noted,
                    fileList,
                    updated_time: new Date().getTime(),
                    order_status: '0'
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