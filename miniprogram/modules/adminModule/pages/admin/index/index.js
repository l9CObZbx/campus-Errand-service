import { userBehavior } from './behavior'
import { formatTime } from '@/utils/formatTime'
import { modal } from '@/utils/extendApi'
import cloud from '@/utils/cloud'

Page({
    behaviors: [userBehavior],
    data: {
        count: '',
        time: '',
        userCount: '',
        confirmCount: '',
        orderCount: ''
    },

    async getAdminInfo() {

        const res = await cloud('adminGetInfo', {
            openid: this.data.openid
        })

        const { totalUsers, verifiedUsers, orderCount } = res.data
        const { count, time } = res.data.admin[0]

        const formatedTime = formatTime(new Date(time))

        this.setData({
            count: count,
            time: formatedTime,
            userCount: totalUsers,
            confirmCount: verifiedUsers,
            orderCount
        })
    },

    onLoad() {
        this.getAdminInfo()
    },

    onShow() {
        wx.hideHomeButton()
    },

    logout() {
        modal({
            confirmColor: '#409eff',
            success(res) {
                if (res.confirm) {
                    wx.reLaunch({
                        url: '/pages/my/my'
                    })
                }
            }
        })
    },


    toUserManage() {
        wx.navigateTo({
            url: '../userList/userList',
        })
    },
    toConfirmManage() {
        wx.navigateTo({
            url: '../confirmList/confirmList',
        })
    },
    toInformManage() {
        wx.navigateTo({
            url: '../informList/informList',
        })
    },
    toOrderManage() {
        wx.navigateTo({
            url: '../orderList/orderList',
        })
    },
})
