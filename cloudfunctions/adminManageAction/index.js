// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

    const { openid, action } = event

    if (!openid || !action) {
        return { code: 400, message: '参数缺失' }
    }

    // 获取目标用户信息
    const userRes = await db.collection('users').where({ openid }).get()
    if (userRes.data.length === 0) {
        return { code: 404, message: '目标用户未找到' }
    }

    try {
        if (action === 'forbid') {
            await db.collection('users').where({ openid }).update({
                data: {
                    status: 1
                }
            })
            return {
                code: 200,
                message: '用户已封禁'
            }
        }
        else if (action === 'norm') {
            await db.collection('users').where({ openid }).update({
                data: {
                    status: 0
                }
            })
            return {
                code: 200,
                message: '用户已解封'
            }
        }
        else {
            return { code: 400, message: '无效操作' }
        }
    }
    catch {
        return {
            code: 1217
        }
    }

}