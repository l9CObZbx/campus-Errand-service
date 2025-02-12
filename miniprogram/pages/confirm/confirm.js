import { toast } from '@/utils/extendApi'
import cloud from '@/utils/cloud'
import { userBehavior } from './behavior'
import { setStorage } from '@/utils/storage'

Page({
    behaviors: [userBehavior],

    // 页面的初始数据
    data: {
        name: '',
        phone: '',
        studentID: '',
        fileID: '',
        tempImage: '',
        title_text: ['未认证', '审核中', '已通过', '已拒绝'],
        is_verified_class: ['', '', 'green', 'red']
    },

    onLoad() {
        if (this.data.is_verified === 0) return

        const { name, phone, studentID, fileID } = this.data.certifications

        this.setData({
            name, phone, studentID, fileID
        })
    },

    // 获取并校验
    getName(e) {
        const { value } = e.detail
        if (!value) return

        const nameRegex = /^[\u4e00-\u9fa5]{2,10}$/


        if (!nameRegex.test(value)) {
            toast({
                title: '真实姓名有误',
                icon: 'error',
                mask: false,
                duration: 1000
            })

            return
        }

        this.data.name = value
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

        this.data.phone = value
    },

    // 获取并校验
    getStduentID(e) {
        const { value } = e.detail
        if (!value) return

        const addressRegex = /^\d{6,18}$/

        if (!addressRegex.test(value)) {
            toast({
                title: '学号格式有误',
                icon: 'error',
                mask: false,
                duration: 1000
            })

            return
        }

        this.data.studentID = value
    },

    async getIamge() {
        const originRes = await wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            sizeType: ['compressed'],
            camera: 'back',
        })

        const compressRes = await wx.compressImage({
            src: originRes.tempFiles[0].tempFilePath,
            quality: 70
        })

        this.setData({
            tempImage: compressRes.tempFilePath
        })
    },


    // 需要优先使用fileID渲染，其次为使用tempImage
    previewImage() {
        if (this.data.fileID) {
            wx.previewImage({
                urls: [this.data.fileID]
            })

        } else {
            wx.previewImage({
                urls: [this.data.tempImage]
            })
        }
    },


    // 保存
    async saveConfirmData() {
        const { name, phone, studentID, tempImage, openid } = this.data
        if (!name || !phone || !studentID) {
            toast({
                title: '不能有空数据',
                icon: 'error',
                mask: false,
                duration: 1000
            })
            return
        }

        if (!tempImage) {
            toast({
                title: '请重新上传图片',
                icon: 'error',
                mask: false,
                duration: 1000
            })
            return
        }

        wx.showLoading({
            title: '数据提交中...'
        })

        const { fileID } = await wx.cloud.uploadFile({
            cloudPath: 'confirm/' + openid + '_' + Date.now() + '.jpg',
            filePath: tempImage
        })

        const { code, data } = await cloud('userConfirm', {
            name, phone, studentID, openid, fileID
        })

        if (code === 200) {
            setStorage('is_verified', 1)
            setStorage('certifications', data)

            this.setIs_verified(1)
            this.setCertifications(data)

            wx.switchTab({
                url: '/pages/my/my',
            })
        }

        wx.hideLoading()
    }
})
