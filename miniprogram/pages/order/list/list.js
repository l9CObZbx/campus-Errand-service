// pages/order/list/index.js
import { userBehavior } from './behavior.js'
import cloud from '@/utils/cloud.js'
import { formatTime } from '@/utils/formatTime'
import { toast } from '@/utils/extendApi.js'

Page({
    behaviors: [userBehavior],
    // 页面的初始数据
    data: {
        orderList: [
        ],
        typeOptions: ['快递', '急事'],
        requiresOffCampusOptions: ['校内', '校外'],
        typeSelectedOption: '', // 类型栏文字内容
        requiresOffCampusSelectedOption: '', // 位置栏文字内容
        selectedAll: true,       // 是否高亮 "全部"
        selectedType: false,     // 是否高亮 "类型"
        selectedLocation: false, // 是否高亮 "位置"
        listType: '', // hall 大厅 deliver 派送 my 我的
        paramsMap: {
            'hall': { order_status: '0' },
            'deliver': {},
            'my': {}
        },
        statusClassMap: ['zero', 'one', 'two', 'three'],
        statusClassText: ['待接单', '进行中', '已完成', '已取消'],
        field: {
            _id: true,
            user_pay: true,
            expected_time: true,
            order_type: true,
            requires_off_campus: true,
            price: true,
            pickup_location: true,
            order_brief: true,
            order_status: true
        },

        order_type: '', // 订单类型
        requires_off_campus: '', // 是否离校
        page: 1, // 当前页码
        pageSize: 10, // 每页条数
        total: 0, // 总条数
        loading: false, // 加载状态
        allLoaded: false, // 是否已加载全部数据
    },

    // 获取数据
    async getOrderList() {
        if (this.data.loading || this.data.allLoaded) return
        this.setData({ loading: true })

        // 参数准备
        const { order_type, requires_off_campus, field, openid, listType, paramsMap } = this.data
        const query = { ...paramsMap[listType] }

        // 订单派送
        if (listType === 'deliver') query.use_receive = openid

        // 我的订单
        if (listType === 'my') query.user_pay = openid

        // 其他查询参数
        if (order_type !== undefined && order_type !== null && order_type !== '') {
            query.order_type = order_type
        }
        if (requires_off_campus !== undefined && requires_off_campus !== null && requires_off_campus !== '') {
            query.requires_off_campus = requires_off_campus
        }

        const { total, result, code } = await cloud('orderList', { query, field, listType })

        const formatArr = result.data.map(item => ({
            ...item,
            expected_time: formatTime(new Date(item.expected_time))
        }))

        if (code === 200) {
            this.setData({
                orderList: [...this.data.orderList, ...formatArr],
                total,
                allLoaded: this.data.orderList.length + formatArr.length >= total, // 判断是否加载完成
                page: this.data.page + 1, // 增加页码
                loading: false
            })
            return
        }

        // 重置加载状态
        this.data.loading = false
    },

    // 获取页面参数 并发起首次请求
    onLoad(options) {
        const { title, listType } = options
        this.setData({
            listType
        })

        wx.setNavigationBarTitle({
            title
        })
    },


    onShow() {
        this.getOrderList()
    },

    // 点击 全部
    onTapAll() {
        this.setData({
            orderList: [],
            typeSelectedOption: '',
            requiresOffCampusSelectedOption: '',
            selectedAll: true,
            selectedType: false,
            selectedLocation: false,
            order_type: '',
            requires_off_campus: '',
            page: 1,
            total: 0,
            allLoaded: false,
        })
        this.getOrderList()
    },

    // 点击类型
    onTypeOptionChange(e) {
        this.setData({
            orderList: [],
            typeSelectedOption: this.data.typeOptions[e.detail.value],
            selectedAll: false,
            selectedType: true,
            order_type: Number(e.detail.value),
            page: 1,
            total: 0,
            allLoaded: false,
        })
        this.getOrderList()
    },

    // 点击位置
    onRequiresOffCampusOptionChange(e) {
        this.setData({
            orderList: [],
            requiresOffCampusSelectedOption: this.data.requiresOffCampusOptions[e.detail.value],
            selectedAll: false,
            selectedLocation: true,
            requires_off_campus: Number(e.detail.value),
            page: 1,
            total: 0,
            allLoaded: false,
        })
        this.getOrderList()
    },

    // 触底加载
    onReachBottom() {
        this.getOrderList()
    },

    // 接单
    async takeOrder(e) {
        if (this.data.status !== 0) {
            toast({
                title: '账户异常',
                mask: false
            })
            return
        }

        if (this.data.is_verified !== 2) {
            toast({
                title: '认证后才可以接单',
                mask: false
            })
            return
        }

        const { order_id, user_pay_id } = e.currentTarget.dataset
        if (user_pay_id === this.data.openid) {
            toast({
                title: '不能接自己的订单',
                mask: false
            })
            return
        }

        const { code } = await cloud('orderTake', {
            openid: this.data.openid,
            order_id
        })

        if (code === 200) {

            const newOrderList = this.data.orderList.filter(item => item._id !== order_id)

            this.setData({
                orderList: newOrderList
            })

            toast({
                title: '接单成功，可在订单派送查看',
                mask: false
            })
        }
    },

    // 查看详情
    checkDetail(e) {
        const { order_id } = e.currentTarget.dataset
        this.setData({
            loading: false,
            allLoaded: false,
            orderList: []
        })

        if (this.data.listType === 'deliver') {
            wx.navigateTo({
                url: `/pages/order/detail/detail?order_id=${order_id}&detailType=send`
            })
        }
        if (this.data.listType === 'my') {
            wx.navigateTo({
                url: `/pages/order/detail/detail?order_id=${order_id}&detailType=my`
            })
        }
    }
})
