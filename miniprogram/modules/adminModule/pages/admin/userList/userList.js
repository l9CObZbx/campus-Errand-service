import cloud from "@/utils/cloud"
import { formatTime } from '@/utils/formatTime'
import { debounce } from '@/utils/debounce'
import { toast } from '@/utils/extendApi'

Page({
    data: {
        users: [],
        tabBar: ['正常', '封禁'],
        activeIndex: 0,
        status: 0,
        page: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        allLoaded: false,
        show: false,
        statusClass: 'norm',
        openid: ''
    },

    // tab栏切换
    tabBarChange(e) {
        const { index } = e.currentTarget.dataset
        // 映射对象
        const statusMap = {
            0: 'norm',
            1: 'forbid'
        };

        const statusClass = statusMap[index] || ''

        this.setData({
            activeIndex: index,
            users: [],
            status: index,
            page: 1,
            total: 0,
            allLoaded: false,
            statusClass
        })

        // 防抖
        this.debouncedGetUserList()
    },

    async getUserList() {
        if (this.data.loading || this.data.allLoaded) return

        this.setData({ loading: true })

        const res = await cloud('adminManage', {
            status: this.data.activeIndex,
            page: this.data.page,
            pageSize: this.data.pageSize
        })

        if (res.code === 200) {
            const newUsers = res.data.map(item => {
                return {
                    ...item,
                    createTime: formatTime(new Date(item.createTime))
                }
            })
            const total = res.total

            this.setData({
                users: [...this.data.users, ...newUsers],
                total,
                allLoaded: this.data.users.length + newUsers.length >= total,
                page: this.data.page + 1,
                loading: false
            })
        }

        this.data.loading = false
    },


    onLoad() {
        this.getUserList()

        // 防抖
        this.debouncedGetUserList = debounce(this.getUserList.bind(this), 300)
    },

    // 禁用用户
    async forbid(event) {
        const openid = event.currentTarget.dataset.id

        const res = await cloud('adminManageAction', {
            openid,
            action: 'forbid'
        })

        if (res.code === 200) {
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
                title: '用户已经封禁',
                mask: false
            })
        }
    },

    // 解封用户
    async norm(event) {
        const openid = event.currentTarget.dataset.id

        const res = await cloud('adminManageAction', {
            openid,
            action: 'norm'
        })

        if (res.code === 200) {
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
                title: '用户已经解封',
                mask: false
            })
        }
    }
})
