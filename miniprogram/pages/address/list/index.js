// pages/address/list/index.js
import cloud from '@/utils/cloud'
import { setStorage } from '@/utils/storage'
import { swiperCellClose } from '@/behavior/swiperCellClose'
import { userBehavior } from './behavior'

Page({
    behaviors: [swiperCellClose, userBehavior],
    // 页面的初始数据
    data: {
        addressList: [],
        from: ''
    },

    // 选地址逻辑
    onLoad(options) {
        this.data.from = options.from
    },

    chooseAddress(event) {

        if (this.data.from !== 'orderPage') return

        const { id } = event.currentTarget.dataset

        const pages = getCurrentPages(); // 获取页面栈
        const prevPage = pages[pages.length - 2]; // 获取上一个页面实例
        prevPage.setData({
            addressId: id // 设置要传递的参数
        });

        wx.navigateBack()
    },

    // 频繁触发可能会有性能问题
    onShow() {
        this.getAddressList()
    },

    // 获取地址列表
    async getAddressList() {
        const { code, data } = await cloud('addressGet', {
            openid: this.data.openid
        })

        if (code === 200) {
            this.setData({
                addressList: data
            })

            setStorage('addressList', data)
            this.setAddressList(data)
        }
    },

    // 去编辑页面
    toEdit(e) {
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/address/add/index?id=${id}`
        })
    },

    // 删除地址
    async delAddress(e) {
        const { id } = e.currentTarget.dataset
        const { code } = await cloud('addressDel', {
            id,
            openid: this.data.openid
        })
        if (code === 200) {
            this.getAddressList()
        }
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.getAddressList()
        wx.stopPullDownRefresh()
    }
})
