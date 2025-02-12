import { userBehavior } from './behavior'
import { clearStorage } from '@/utils/storage'
import cloud from '@/utils/cloud'
Page({
    behaviors: [userBehavior],

    data: {
        clickTime: 0,
        show: false,  // 控制自定义弹框的显示/隐藏
        pwd: ''

    },

    // 显示弹框
    onClickShow() {
        this.data.clickTime += 1
        if (this.data.clickTime > 2) {
            this.setData({
                show: true
            })
        }
    },

    // 确定按钮的点击处理
    async onConfirm() {
        const regex = /^\d{6}$/

        if (!this.data.pwd) return
        if (!regex.test(this.data.pwd)) return

        const { code } = await cloud('adminLogin', {
            openid: this.data.openid,
            adminPassword: this.data.pwd
        })

        if (code === 200) {
            wx.reLaunch({
                url: '../../modules/adminModule/pages/admin/index/index',
            })
        }
    },

    // 清除缓存
    clearLocalStorage() {
        clearStorage()
        wx.navigateBack()
    }
})