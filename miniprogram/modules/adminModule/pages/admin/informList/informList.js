// pages/order/list/index.js

import cloud from '@/utils/cloud.js'
import { formatTime } from '@/utils/formatTime'
import { toast } from '@/utils/extendApi.js'

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

    onShow() {
        this.getInformList()
    },


    add() {
        wx.navigateTo({
            url: '/pages/admin/informDetail/informDetail',
        })
    },

    modify(e) {
        const _id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/admin/informDetail/informDetail?_id=${_id}`,
        })
    },
    async remove(e) {
        const _id = e.currentTarget.dataset.id
        const { code } = await cloud('informRemove', { _id })
        if (code === 200) {
            toast({
                title: '成功',
                mask: false
            })
            this.setData({
                informList: this.data.informList.filter(item => item._id !== _id)
            })
        }
    }

})
