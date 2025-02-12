// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    if (openid !== event.openid) {
        return {
            code: 403,
            message: 'openid不一致'
        }
    }

    const { name, studentID, phone, fileID } = event

    if (!name || !studentID || !phone || !fileID) {
        return { code: 400, message: '参数缺失' };
    }

    // 检查用户是否注册
    const userRes = await db.collection('users').where({ openid }).get();
    if (userRes.data.length === 0) {
        return { code: 404, message: '用户未注册' };
    }

    const user = userRes.data[0];

    if (user.is_verified === 2) {
        return { code: 403, message: '用户认证已通过，无法修改' };
    }

    // 删除上一次上传的认证照片
    if (user.is_verified === 1 || user.is_verified === 3) {
        await cloud.deleteFile({
            fileList: [user.certifications.fileID]
        })
    }

    // 更新认证信息
    const certifications = {
        name,
        studentID,
        phone,
        fileID
    };

    await db.collection('users').where({ openid }).update({
        data: {
            certifications,
            is_verified: 1,
            certificationTime: new Date().getTime()
        },
    });

    return {
        code: 200,
        message: '认证提交成功，等待审核',
        data: certifications,
    };

}