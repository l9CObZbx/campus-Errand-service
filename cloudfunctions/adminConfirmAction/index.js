// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 待完善

// 云函数入口函数
exports.main = async (event, context) => {

    const { openid, action, rejectReason } = event

    if (!openid || !action) {
        return { code: 400, message: '参数缺失' }
    }

    // 获取目标用户信息
    const userRes = await db.collection('users').where({ openid }).get()
    if (userRes.data.length === 0) {
        return { code: 404, message: '目标用户未找到' }
    }

    const user = userRes.data[0]

    // if (user.is_verified !== 1) {
    //     return { code: 403, message: '用户不处于审核中状态' }
    // }

    if (action === 'approve') {
        // 修改为通过
        await db.collection('users').where({ openid }).update({
            data: { is_verified: 2 },
        })

        return {
            code: 200,
            message: '用户认证通过',
        };
    } else if (action === 'reject') {
        if (!rejectReason) {
            return { code: 400, message: '拒绝理由未提供' };
        }

        // 修改为已拒绝并记录拒绝理由
        const certifications = {
            ...user.certifications,
            rejectReason,
        };

        await db.collection('users').where({ openid }).update({
            data: {
                certifications,
                is_verified: 3,
            },
        });

        return {
            code: 200,
            message: '用户认证已拒绝',
        };
    } else {
        return { code: 400, message: '无效操作' }
    }
}