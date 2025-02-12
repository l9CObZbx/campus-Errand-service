// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 默认头像fileID
const avatarFileID = 'cloud://ilyaa-9gnyr33g2884e8ee.696c-ilyaa-9gnyr33g2884e8ee-1329892735/resource/avatar/avatar.png'

// 云函数入口函数
exports.main = async (event, context) => {

    // 获取openid
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    // 检索数据库
    const checkUser = await db.collection('users').where({ openid }).get()

    // 创建用户
    if (checkUser.data.length === 0) {
        const newUser = {
            openid,
            nickname: '微信用户',
            avatarFileID: avatarFileID,
            createTime: new Date().getTime(), // 用户注册时间
            addresses: [],
            status: 0,
            is_verified: 0,
            certifications: {},
            certificationTime: '' // 认证信息更新时间
        }

        const result = await db.collection('users').add({ data: newUser })

        return {
            code: 200,
            message: '注册成功',
            data: {
                userInfo: newUser
            }
        }
    }

    return {
        code: 200,
        message: '登录成功',
        data: {
            userInfo: checkUser.data[0]
        }
    }

}