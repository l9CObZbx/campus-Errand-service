import { toast } from '@/utils/extendApi'
import cloud from '@/utils/cloud'
import { userBehavior } from './behavior'

Page({
    behaviors: [userBehavior],

    // 页面的初始数据
    data: {
        contactName: '',
        contactPhone: '',
        address: '',
        isDefault: true,
        id: '',
        isEditAddress: false
    },

    onLoad(options) {
        const { id } = options
        if (id) {
            wx.setNavigationBarTitle({
                title: '修改收货地址'
            })
            const echoAddress = this.data.addressList.find(item => item.id === id)
            const { contactName, contactPhone, address, isDefault } = echoAddress
            this.setData({
                contactName,
                contactPhone,
                address,
                isDefault
            })
            this.data.id = id
            this.data.isEditAddress = true
        }
    },

    // 获取并校验
    getName(e) {
        const { value } = e.detail
        if (!value) return

        const nameRegex = /^[\u4e00-\u9fa5]{2,5}$/


        if (!nameRegex.test(value)) {
            toast({
                title: '联系人有误',
                icon: 'error',
                mask: false,
                duration: 1000
            })

            return
        }

        this.data.contactName = value
    },

    // 获取并校验
    getPhone(e) {
        const { value } = e.detail
        if (!value) return

        const phoneRegex = /^1[3-9]\d{9}$/


        if (!phoneRegex.test(value)) {
            toast({
                title: '联系电话有误',
                icon: 'error',
                mask: false,
                duration: 1000
            })

            return
        }

        this.data.contactPhone = value
    },

    // 获取并校验
    getAddress(e) {
        const { value } = e.detail
        if (!value) return

        // const addressRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]{3,30}$/
        const addressRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s,.，。!？-]{3,30}$/

        if (!addressRegex.test(value)) {
            toast({
                title: '详细地址有误',
                icon: 'error',
                mask: false,
                duration: 1000
            })

            return
        }

        this.data.address = value
    },

    handleSwitchChange(e) {
        this.setData({
            isDefault: e.detail.value, // 更新绑定数据
        })
    },

    // 保存收货地址
    saveAddrssForm() {
        setTimeout(async () => {

            const { contactName, contactPhone, address, isDefault, openid } = this.data
            if (!contactName || !contactPhone || !address) {
                toast({
                    title: '不能有空数据',
                    icon: 'error',
                    mask: false,
                    duration: 1000
                })
                return
            }

            // 修改地址逻辑
            if (this.data.isEditAddress) {
                const { code } = await cloud('addressUpdate', {
                    id: this.data.id,
                    contactName,
                    contactPhone,
                    address,
                    isDefault,
                    openid
                })

                if (code === 200) {
                    wx.navigateBack()
                    toast({
                        title: '修改成功',
                        mask: false
                    })
                }
                return
            }




            const { code } = await cloud('addressAdd', {
                contactName, contactPhone, address, isDefault, openid
            })

            if (code === 200) {
                wx.navigateBack()
                toast({
                    title: '添加成功',
                    mask: false
                })
            }
        }, 50)
    }
})
