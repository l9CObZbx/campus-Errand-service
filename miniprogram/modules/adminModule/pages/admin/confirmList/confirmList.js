import cloud from '@/utils/cloud'
import { toast } from '@/utils/extendApi'
import { debounce } from '@/utils/debounce'

Page({
    data: {
        tabBar: ['待审核', '已通过', '已拒绝'],
        users: [],
        activeIndex: 0,
        is_verified: 1, // 待审核状态，默认值 1（可以动态切换）
        rejectReason: '',
        page: 1, // 当前页码
        pageSize: 10, // 每页条数
        total: 0, // 总条数
        loading: false, // 加载状态
        allLoaded: false, // 是否已加载全部数据
        show: false,
        statusClass: '',
        openid: ''
    },

    // tab栏切换
    tabBarChange(e) {
        const { index } = e.currentTarget.dataset
        // 映射对象
        const statusMap = {
            1: 'approve',
            2: 'reject'
        };

        const statusClass = statusMap[index] || ''

        this.setData({
            activeIndex: index,
            users: [],
            is_verified: index + 1,
            page: 1,
            total: 0,
            allLoaded: false,
            statusClass
        })
        this.debouncedGetConfirmList()
    },


    onLoad() {
        this.getConfirmList()

        // 防抖
        this.debouncedGetConfirmList = debounce(this.getConfirmList.bind(this), 300)
    },

    // 获取数据
    async getConfirmList() {
        if (this.data.loading || this.data.allLoaded) return

        this.setData({ loading: true })

        const res = await cloud('adminConfirm', {
            is_verified: this.data.is_verified, // 用户状态
            page: this.data.page,
            pageSize: this.data.pageSize
        })

        if (res.code === 200) {
            // 解构赋值
            const newUsers = res.data
            const total = res.total

            this.setData({
                users: [...this.data.users, ...newUsers],
                total,
                allLoaded: this.data.users.length + newUsers.length >= total, // 判断是否加载完成
                page: this.data.page + 1, // 增加页码
                loading: false
            })
            return
        }

        // 重置加载状态
        this.data.loading = false
    },

    // 触底加载
    onReachBottom() {
        this.getConfirmList()
    },

    // 图片预览
    previewImage(e) {
        wx.previewImage({
            urls: [e.currentTarget.dataset.fileid]
        })
    },

    // 通过用户认证
    async resolve(e) {
        const { openid } = e.currentTarget.dataset
        const { code } = await cloud('adminConfirmAction', {
            openid,
            action: 'approve',
        })

        if (code === 200) {
            const index = this.data.users.findIndex(item => item.openid === openid)
            if (index !== -1) {
                // 浅拷贝数组并移除目标元素
                const updatedUsers = [...this.data.users];
                updatedUsers.splice(index, 1);

                // 更新数据
                this.setData({
                    users: updatedUsers
                })
            }

            toast({
                title: '用户认证通过',
                mask: false
            })
        }
    },

    // 拒绝按钮的弹框
    reject(e) {
        const { openid } = e.currentTarget.dataset
        this.data.openid = openid
        this.setData({ show: true })
    },

    // 提交用户的拒绝
    async onConfirm() {
        if (!this.data.rejectReason) return

        const { openid } = this.data

        const { code } = await cloud('adminConfirmAction', {
            openid,
            action: 'reject',
            rejectReason: this.data.rejectReason
        })

        if (code === 200) {
            const index = this.data.users.findIndex(item => item.openid === openid)
            if (index !== -1) {
                // 浅拷贝数组并移除目标元素
                const updatedUsers = [...this.data.users];
                updatedUsers.splice(index, 1);

                // 更新数据
                this.setData({
                    users: updatedUsers
                })
            }

            toast({
                title: '用户认证已拒绝',
                mask: false
            })
        }
    }
})
