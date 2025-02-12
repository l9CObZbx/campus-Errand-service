import { userBehavior } from './behavior.js'
import cloud from '@/utils/cloud.js'

import { asyncGetStorage, getStorage } from '@/utils/storage'

Page({
    behaviors: [userBehavior],

    data() {
        unreceiveCount: ''
    },

    async onLoad() {
        const { code, result } = await cloud('orderUnreceiveCount')
        if (code === 200) {
            this.setData({
                unreceiveCount: result.total
            })
        }
    },

    toOrderList() {
        if (!this.data.openid) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return
        }
        wx.navigateTo({
            url: '/pages/order/list/list?listType=hall',
        })
    },

    toOrderPost() {
        if (!this.data.openid) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return
        }
        wx.navigateTo({
            url: '/pages/order/post/post?postType=post',
        })
    },

    toDeliverList() {
        if (!this.data.openid) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return
        }
        wx.navigateTo({
            url: '/pages/order/list/list?title=订单派送&&listType=deliver',
        })
    }
})
