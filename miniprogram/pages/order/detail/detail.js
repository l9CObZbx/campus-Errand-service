import { userBehavior } from './behavior.js'
import { formatTime } from '@/utils/formatTime'
import { toast } from '@/utils/extendApi'
import cloud from '@/utils/cloud.js'

const types = {
    快递: ['校内', '校外'],
    急事: ['校内', '校外'],
}

Page({
    behaviors: [userBehavior],

    data: {
        typeText: '',
        order_id: '', // 用于回显的订单ID
        detailType: '', // 回显类型判断
        showMask: true, // 控制遮罩层显示
        user_pay_info: '', // 用户信息
        expected_time: '', // 预期送达日期
        order_type: '', // 订单类型（0 快递、1 急事）
        requires_off_campus: '', // 是否需要出校（0 否、1 是）
        price: '', // 价格
        pickup_location: '', // 订单取件地址
        order_brief: '', // 订单简述
        oreder_noted: '', // 订单备注，默认值为Null
        fileList: [], // 订单相关图片的fileID的数组
        order_status: ''
    },

    // 订单列表查看详情时回显逻辑
    async onLoad(options) {

        const { order_id, detailType } = options
        this.setData({ order_id, detailType })
        const query = {
            _id: order_id,
        }

        if (order_id && detailType === 'send') {
            query.use_receive = this.data.openid
            this.reviewDetail(query)
        }
        if (order_id && detailType === 'my') {
            query.user_pay = this.data.openid
            this.reviewDetail(query)
        }
    },

    // 获取订单信息
    async reviewDetail(query) {
        const { code, result } = await cloud('orderDetail', { query })
        if (code === 200) {
            const reviewObj = result.data[0]

            const expected_time = formatTime(new Date(reviewObj.expected_time))
            const order_type_text = ['快递', '急事']
            const requires_off_campus_text = ['校内', '校外']
            const typeText = `${order_type_text[reviewObj.order_type]} ${requires_off_campus_text[reviewObj.requires_off_campus]}`

            this.setData({
                user_pay_info: reviewObj.user_pay_info, // 用户信息
                expected_time, // 预期送达日期
                typeText,
                price: reviewObj.price, // 价格
                pickup_location: reviewObj.pickup_location, // 订单取件地址
                order_brief: reviewObj.order_brief, // 订单简述
                oreder_noted: reviewObj.oreder_noted, // 订单备注，默认值为Null
                fileList: reviewObj.fileList, // 图片
                order_status: reviewObj.order_status
            })
        }
    },

    async finishOrder() {
        const { order_id } = this.data
        const query = {
            _id: order_id
        }
        const { code } = await cloud('orderFinish', { query })
        if (code === 200) {
            // wx.switchTab({
            //     url: '/pages/index/index',
            // })
            wx.navigateBack()
            toast({
                title: '成功'
            })
        }
    },

    // 取消订单
    async cancleOrder() {
        const { order_id, order_status } = this.data
        if (order_status !== '0') {
            toast({
                title: '订单无法取消',
                mask: false
            })
            return
        }

        const query = {
            _id: order_id
        }
        const { code } = await cloud('orderCancle', { query })
        if (code === 200) {
            wx.navigateBack()
            // wx.switchTab({
            //     url: '/pages/my/my'
            // })
            toast({
                title: '成功'
            })
        }
    },

    // 修改订单
    async modifyOrder() {
        const { order_id, order_status } = this.data
        if (order_status === '1' || order_status === '2') {
            toast({
                title: '订单无法修改',
                mask: false
            })
            return
        }
        wx.navigateTo({
            url: `/pages/order/post/post?postType=modify&order_id=${order_id}`
        })
    },

    previewImage(e) {
        const { index } = e.currentTarget.dataset
        wx.previewImage({
            urls: [this.data.fileList[index]]
        })
    },

    // 阻止点击事件
    preventTap() {
        // 防止点击事件向下传递
        return false;
    },

    // 取消警告
    fakeCallBack() { }
})