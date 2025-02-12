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
        show: false,
        popupType: '', // 控制弹出层的展示类型
        typeText: '',
        currentDate: new Date().getTime(),
        // minDate: new Date().getTime() + 30 * 60 * 1000,
        minDate: Math.ceil(new Date().getTime() / (1000 * 60 * 5)) * 5 * 60 * 1000,
        maxDate: new Date().setFullYear(new Date().getFullYear() + 1),
        columns: [
            {
                values: Object.keys(types),
                className: 'column1',
            },
            {
                values: types['快递'],
                className: 'column2',
                defaultIndex: 0,
            },
        ],
        filter(type, options) {
            if (type === 'minute') {
                return options.filter((option) => option % 5 === 0);
            }
            return options;
        },
        tempFileList: [], // 临时地址数组

        isLoading: false, // 判断是否加载
        order_id: '',
        expected_time_text: '',

        user_pay_info: '', // 用户信息
        expected_time: '', // 预期送达日期
        order_type: '', // 订单类型（0 快递、1 急事）
        requires_off_campus: '', // 是否需要出校（0 否、1 是）
        price: '', // 价格
        pickup_location: '', // 订单取件地址
        order_brief: '', // 订单简述
        oreder_noted: '', // 订单备注，默认值为Null
        fileList: [], // 订单相关图片的fileID的数组

        oldFileList: [], // 原始相关图片的fileID的数组
        order_status: ''
    },

    // 显示默认地址逻辑 || 回显数据
    async onLoad(options) {
        const { order_id } = options

        // 回显数据
        if (order_id) {
            wx.setNavigationBarTitle({ title: '修改订单' })
            this.setData({ order_id })
            this.reviewDetail(order_id)
            return
        }

        // 发布订单时显示默认地址逻辑
        if (this.data.addressList.length === 0) return
        const user_pay_info = this.data.addressList.filter(item => item.isDefault === true)[0]
        this.setData({
            user_pay_info
        })
    },

    // 地址切换逻辑
    onShow() {
        // 在返回到此页面时触发，可以根据传递的数据刷新页面
        if (!this.data.addressId) return

        const obj = this.data.addressList.filter(item => item.id === this.data.addressId)[0]

        const { contactName, contactPhone, address } = obj
        const user_pay_info = { contactName, contactPhone, address }
        this.setData({
            user_pay_info
        })
    },

    // 跳转到收货地址
    toAddress() {
        wx.navigateTo({
            url: '/pages/address/list/index?from=orderPage'
        })
    },

    // 展示popur弹出层
    onShowPopUp(e) {
        const type = e.currentTarget.dataset.type

        this.setData({
            show: true,
            popupType: type
        })
    },

    // 期望送达日期确定按钮
    onConfirmTimerPicker(event) {
        this.setData({
            show: false,
            expected_time_text: formatTime(new Date(event.detail)),
            expected_time: event.detail
        })
    },

    // 类型选择确认按钮
    onConfirmType(e) {
        this.setData({
            show: false,
            order_type: e.detail.index[0],
            requires_off_campus: e.detail.index[1],
            typeText: `${e.detail.value[0]} ${e.detail.value[1]}`
        })

    },

    // 期望送达日期和类型选择 取消按钮 以及 关闭弹框时触发
    onCancel() {
        this.setData({
            show: false,
            minDate: new Date().getTime() + 30 * 60 * 1000,
            currentDate: new Date().getTime()
        })
    },

    // 文件临时路径
    afterRead(event) {
        const { file } = event.detail
        if (Array.isArray(file)) {
            this.setData({
                tempFileList: [...this.data.tempFileList, ...file]
            })
            return
        }

        this.setData({
            tempFileList: [...this.data.tempFileList, file]
        });
    },

    // 删除照片列表
    deleteFile(event) {
        const tempFileList = this.data.tempFileList.filter((_, index) => index !== event.detail.index)
        this.setData({
            tempFileList
        })
    },

    // 提交
    async submitOrder() {
        if (this.data.isLoading) return




        const {
            openid,
            user_pay_info,
            expected_time,
            order_type,
            requires_off_campus,
            price,
            pickup_location,
            order_brief,
            oreder_noted,
            tempFileList,
            order_id,
            oldFileList
        } = this.data


        if (!/^-?\d+(\.\d+)?$/.test(price)) {
            toast({
                icon: 'error',
                title: '价格类型错误',
                mask: false,
            });
            return
        }


        if ([user_pay_info, expected_time, order_type, requires_off_campus, price, pickup_location, order_brief].some(field => field === null || field === undefined || field === '')) {
            toast({
                icon: 'error',
                title: '数据不足',
                mask: false,
            });
            return;
        }



        // 设置加载状态
        this.data.isLoading = true

        // 修改逻辑
        if (order_id) {
            const data = {
                _id: order_id,
                user_pay_info,
                expected_time,
                order_type,
                requires_off_campus,
                price,
                pickup_location,
                order_brief,
                oreder_noted
            }

            // 需要删除的原始数组
            data.oldFileList = oldFileList

            // 上传图片至云存储
            if (tempFileList.length !== 0) {
                wx.showLoading({
                    title: '图片上传中...',
                })
                const uploadTasks = tempFileList.map((item) => {
                    const randomNumber = Math.random().toString(36).substring(2, 8); // 生成一个 6 位随机字符串
                    const cloudPath = `order/${this.data.openid}/` + Date.now() + '_' + randomNumber + '.jpg'// 云存储路径
                    return wx.cloud.uploadFile({
                        cloudPath,
                        filePath: item.tempFilePath, // 本地文件路径
                    });
                })

                // 使用 Promise.all 确保所有文件上传完成
                await Promise.all(uploadTasks)
                    .then((results) => {
                        data.fileList = results.map(item => item.fileID)
                    })

                wx.hideLoading()

                // 上传云函数
                const res = await cloud('orderModify', data)
                if (res.code === 200) {
                    wx.hideLoading()

                    // wx.switchTab({
                    //     url: '/pages/index/index'
                    // })
                    wx.navigateBack({
                        delta: 2
                    })
                    toast({
                        title: '修改成功',
                        mask: false
                    })
                }

                return
            }

            // 上传云函数
            const res = await cloud('orderModify', data)
            if (res.code === 200) {
                wx.hideLoading()

                wx.switchTab({
                    url: '/pages/index/index'
                })
                toast({
                    title: '修改成功',
                    mask: false
                })
            }
        }
        // 发布逻辑
        else {
            // 上传对象
            const data = {
                user_pay: openid,
                user_pay_info,
                expected_time,
                order_type,
                requires_off_campus,
                price,
                pickup_location,
                order_brief,
                oreder_noted
            }

            // 上传图片至云存储
            if (tempFileList.length !== 0) {

                wx.showLoading({
                    title: '图片上传中...',
                })

                const uploadTasks = tempFileList.map((item) => {
                    const randomNumber = Math.random().toString(36).substring(2, 8); // 生成一个 6 位随机字符串
                    const cloudPath = `order/${this.data.openid}/` + Date.now() + '_' + randomNumber + '.jpg'// 云存储路径
                    return wx.cloud.uploadFile({
                        cloudPath,
                        filePath: item.tempFilePath, // 本地文件路径
                    });
                })

                // 使用 Promise.all 确保所有文件上传完成
                await Promise.all(uploadTasks)
                    .then((results) => {
                        data.fileList = results.map(item => item.fileID)
                    })

                wx.hideLoading()

                // 上传云函数
                const res = await cloud('orderPost', data)
                if (res.code === 200) {
                    wx.hideLoading()

                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                    toast({
                        title: '发布成功',
                        mask: false
                    })
                }
                return
            }

            await wx.requestSubscribeMessage({
                tmplIds: ['BFbV_nZieKunL0nz6mHU1AEcpjG9PoRJcI7n1P7BL9M']
            })

            const res = await cloud('orderPost', data)
            if (res.code === 200) {
                wx.hideLoading()
                wx.switchTab({
                    url: '/pages/index/index'
                })

                toast({
                    title: '发布成功',
                    mask: false
                })
            }
        }

    },

    // 回显
    async reviewDetail(order_id) {
        const query = {
            _id: order_id,
        }
        const { code, result } = await cloud('orderDetail', { query })
        if (code !== 200) return

        // 订单数据
        const reviewObj = result.data[0]

        // 数据格式转变
        const expected_time = formatTime(new Date(reviewObj.expected_time))
        const order_type_text = ['快递', '急事']
        const requires_off_campus_text = ['校内', '校外']
        const typeText = `${order_type_text[reviewObj.order_type]} ${requires_off_campus_text[reviewObj.requires_off_campus]}`

        // 判断是否需要渲染图片
        if (reviewObj.fileList.length !== 0) {
            // 快速渲染
            this.setData({
                tempFileList: reviewObj.fileList.map(item => {
                    return {
                        url: item,
                        type: 'image'
                    }
                })
            })
            // 下载
            await this.tempFileDownload(reviewObj.fileList)
        }

        this.setData({
            user_pay_info: reviewObj.user_pay_info, // 用户信息
            expected_time, // 预期送达日期
            expected_time_text: formatTime(new Date(expected_time)),
            typeText,
            price: reviewObj.price, // 价格
            pickup_location: reviewObj.pickup_location, // 订单取件地址
            order_brief: reviewObj.order_brief, // 订单简述
            oreder_noted: reviewObj.oreder_noted, // 订单备注，默认值为Null
            oldFileList: reviewObj.fileList, // 原始文件fileID
            order_type: reviewObj.order_type,
            requires_off_campus: reviewObj.requires_off_campus,
            order_status: reviewObj.order_status
        })
    },

    // 图片下载
    async tempFileDownload(fileList) {
        // 获取临时网络路径
        wx.cloud.getTempFileURL({
            fileList: fileList,
        }).then(res => {
            // console.log('获取临时网络路径成功', res);

            // 更新临时文件列表
            const tempFileList = res.fileList.map(item => {
                return {
                    type: 'image',
                    url: item.tempFileURL,
                    tempFileURL: item.tempFileURL
                };
            });

            this.setData({ tempFileList });

            // 下载至本地
            const downloadPromises = tempFileList.map(file => {
                return new Promise((resolve, reject) => {
                    wx.downloadFile({
                        url: file.tempFileURL, // 每个文件的临时链接
                        success: downloadRes => {
                            if (downloadRes.statusCode === 200) {
                                // console.log('文件下载成功：', downloadRes.tempFilePath);
                                resolve({
                                    type: 'image',
                                    tempFilePath: downloadRes.tempFilePath, // 下载后的本地路径
                                    url: downloadRes.tempFilePath
                                });
                            } else {
                                reject(new Error('文件下载失败'));
                            }
                        },
                        fail: error => {
                            console.error('文件下载出错：', error);
                            reject(error);
                        },
                    });
                });
            });

            Promise.all(downloadPromises)
                .then(downloadedFiles => {
                    // console.log('所有文件下载完成：', downloadedFiles);
                    this.setData({
                        tempFileList: downloadedFiles,
                    });
                })
                .catch(error => {
                    console.error('下载过程中出现错误：', error);
                });
        }).catch(error => {
            console.error('获取临时网络路径失败：', error);
        });
    },

    // 取消警告
    fakeCallBack() { },
})