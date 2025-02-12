
import { formatTime } from '@/utils/formatTime'
import { toast } from '@/utils/extendApi'
import cloud from '@/utils/cloud.js'

const types = {
    快递: ['校内', '校外'],
    急事: ['校内', '校外'],
}

Page({

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
        order_status: '',
        priority: '',

        show: false,
        type: '',
        statusColumns: ['待接单', '进行中', '已完成', '已取消'],
        priorityColumns: ['默认', '优先'],
    },

    // 订单列表查看详情时回显逻辑
    async onLoad(options) {

        const { order_id } = options
        this.setData({ order_id })
        const query = {
            _id: order_id,
        }
        this.reviewDetail(query)
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
                order_status: reviewObj.order_status,
                priority: reviewObj.priority
            })
        }
    },


    previewImage(e) {
        const { index } = e.currentTarget.dataset
        wx.previewImage({
            urls: [this.data.fileList[index]]
        })
    },

    statusEdit(e) {
        const { type } = e.target.dataset
        this.setData({ show: true, type })
    },


    priorityEdit(e) {
        const { type } = e.target.dataset
        this.setData({ show: true, type })
    },

    onCancel() {
        this.setData({ show: false })
    },

    async submitStatusModify(e) {
        this.setData({ show: false })
        const { index } = e.detail

        const { code } = await cloud('orderAdminModify', { _id: this.data.order_id, type: 'status', index: String(index) })
        if (code === 200) {
            toast({
                title: '修改成功',
                mask: false,
                success: () => {
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 300)
                }
            })
        }
    },

    async submitPriorityModify(e) {
        this.setData({ show: false })
        const { index } = e.detail
        const { code } = await cloud('orderAdminModify', { _id: this.data.order_id, type: 'priority', index: String(index) })
        if (code === 200) {
            toast({
                title: '修改成功',
                mask: false,
                success: () => {
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 300)
                }
            })
        }
    },

    // 阻止点击事件
    preventTap() {
        // 防止点击事件向下传递
        return false;
    },

    // 取消警告
    fakeCallBack() { }
})