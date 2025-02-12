// pages/order/list/index.js

import cloud from '@/utils/cloud.js'
import { formatTime } from '@/utils/formatTime'

Page({

    // 页面的初始数据
    data: {
        informList: [],
        loading: false, // 加载状态
    },

    // 获取数据
    async getInformList() {
        if (this.data.loading) return
        this.setData({ loading: true })

        const { code, result } = await cloud('informList')

        if (code === 200) {

            const formatArr = result.map(item => ({
                ...item,
                expected_time: formatTime(new Date(item.expected_time))
            }))
            this.setData({
                informList: formatArr,
                loading: false
            })
            return
        }

        // 重置加载状态
        this.data.loading = false
    },

    checkDetail(e) {
        const { data } = e.currentTarget.dataset
        const { title, expected_time, content } = data

        wx.navigateTo({
            url: `/pages/proclaimDetail/proclaimDetail?title=${title}&expected_time=${expected_time}&content=${content}`,
            fail: err => {
                console.log(err)
            }
        })
    },

    onShow() {
        this.getInformList()
    },
})
