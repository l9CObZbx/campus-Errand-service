// pages/info/info.js
import { userBehavior } from './behavior'
import cloud from '@/utils/cloud'

import { clearStorage, getStorage, setStorage } from '@/utils/storage'

Page({
    behaviors: [userBehavior],
    // 页面的初始数据
    data: {
        avatarUrl: '',
        // 初始化第二个面板数据
        initpanel: [
            {
                url: '/pages/order/list/list?listType=my&title=我的订单',
                title: '我的订单',
                iconfont: '../../assets/menu/dingdan.png'
            },
            {
                url: '/pages/address/list/index',
                title: '地址管理',
                iconfont: '../../assets/menu/dizhiguanli.png'
            },
            {
                url: '/pages/confirm/confirm',
                title: '认证管理',
                iconfont: '../../assets/menu/shidirenzheng.png'
            }
        ],
        status_text: ['正常', '封禁'],
        is_verified_text: ['未认证', '审核中', '已通过', '已拒绝'],
        status_class: ['green', 'red'],
        is_verified_class: ['', '', 'green', 'red']
    },

    onLoad() {
        this.getUserStatus()
    },

    cleanCahve() {
        clearStorage()
    },

    async getUserStatus() {
        if (!this.data.openid) return
        console.log(this.data)

        const res = await cloud('userStatus', {
            openid: this.data.openid
        })

        const { is_verified, status, certifications } = res.data[0]

        this.setStatus(status)
        this.setIs_verified(is_verified)
        this.setCertifications(certifications)

        setStorage('status', status)
        setStorage('is_verified', is_verified)
        setStorage('certifications', certifications)
    },

    // 跳转到登录页面
    toLoginPage() {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },

    onPullDownRefresh() {
        this.getUserStatus()
        wx.stopPullDownRefresh()
    },

    navigator(e) {
        if (!this.data.openid) {
            wx.navigateTo({
                url: '/pages/login/login'
            })
            return
        }

        const { url } = e.currentTarget.dataset
        wx.navigateTo({
            url: url,
        })
    }
})
