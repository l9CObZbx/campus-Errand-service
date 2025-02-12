// pages/profile/profile.js
import cloud from '@/utils/cloud'
import { toast } from '@/utils/extendApi'
import { setStorage } from '@/utils/storage'
import { userBehavior } from './behavior'

Page({
    behaviors: [userBehavior],

    // 页面的初始数据
    data: {
        isShowPopup: false, // 控制更新用户昵称的弹框显示与否
        isChange: false, // 优化提交
        tempAvatarUrl: '',
        tempNickname: ''
    },

    // 显示修改昵称弹框
    onUpdateNickName() {
        this.setData({
            isShowPopup: true,
            tempNickname: this.data.tempNickname
        })
    },

    // 弹框取消按钮
    cancelForm() {
        this.setData({
            isShowPopup: false
        })
    },

    getNickname(e) {
        const usernameRegex = /^(?!\s+$)[\u4e00-\u9fa5a-zA-Z0-9ʚɞ_\-\s]{2,20}$/

        if (!usernameRegex.test(e.detail.value.nickname)) {
            toast({
                title: '格式有误',
                icon: 'error'
            })
            return
        }
        this.setData({
            tempNickname: e.detail.value.nickname,
            isShowPopup: false
        })
    },

    getUserAvatar(e) {
        // 获取头像信息的临时路径
        const { avatarUrl } = e.detail
        this.setData({
            tempAvatarUrl: avatarUrl
        })
        this.data.isChange = true
    },

    async submit() {
        // 上传对象
        const data = {}

        // 昵称修改
        if (this.data.tempNickname) {
            console.log(this.data.tempNickname)

            data.nickname = this.data.tempNickname
        }
        // 头像修改
        if (this.data.tempAvatarUrl) {
            console.log(this.data.tempAvatarUrl)

            const { fileID } = await wx.cloud.uploadFile({
                cloudPath: 'avatar/' + this.data.openid + '_' + Date.now() + '.jpg',
                filePath: this.data.tempAvatarUrl
            })
            data.fileID = fileID
        }
        // 上传云函数
        data.openid = this.data.openid

        const { code } = await cloud('userProfile', data)
        if (code === 200) {
            if (data.nickname) {
                setStorage('nickname', data.nickname)
                this.setNickname(data.nickname)
            }
            if (data.fileID) {
                setStorage('avatarFileID', data.fileID)
                this.setAvatarFileID(data.fileID)
            }

            wx.switchTab({
                url: '/pages/my/my',
            })
            toast({
                title: '更新成功',
                mask: false
            })
        }
    }
})