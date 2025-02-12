
import { formatTime } from '@/utils/formatTime'
import { toast } from '@/utils/extendApi'
import cloud from '@/utils/cloud.js'

Page({

    data: {
        show: false,
        isLoading: false, // 判断是否加载
        popupType: '', // 控制弹出层的展示类型
        priorityText: '',
        columns: ['默认', '优先', '最优先'],
        currentDate: new Date().getTime(),
        minDate: Math.ceil(new Date().getTime() / (1000 * 60 * 5)) * 5 * 60 * 1000,
        maxDate: new Date().setFullYear(new Date().getFullYear() + 1),
        filter(type, options) {
            if (type === 'minute') {
                return options.filter((option) => option % 5 === 0);
            }
            return options;
        },

        title: '',
        content: '',
        priority: '',
        expected_time: '',
        expected_time_text: '',
        _id: ''
    },

    onLoad(options) {
        const { _id } = options
        this.review(_id)
        this.setData({ _id })
    },

    async review(_id) {
        const { code, result } = await cloud('informDetail', { _id })
        const expected_time = result[0].expected_time
        const expected_time_text = formatTime(new Date(result[0].expected_time))
        const priorityText = this.data.columns[result[0].priority]
        if (code === 200) {
            this.setData({
                title: result[0].title,
                content: result[0].content,
                priority: result[0].priority,
                expected_time,
                expected_time_text,
                priorityText
            })
        }

    },

    // 标题
    informTitle(e) {
        const { value } = e.detail
        if (!value) {
            toast({
                title: '标题不正确',
                mask: false
            })
        }

        this.setData({ title: value })
    },

    // 内容
    informContent(e) {
        const { value } = e.detail
        if (!value) {
            toast({
                title: '内容不正确',
                mask: false
            })
        }

        this.setData({ content: value })
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
            expected_time: event.detail,
            expected_time_text: formatTime(new Date(event.detail))
        })
    },

    // 类型选择确认按钮
    onConfirmType(e) {
        const { index, value } = e.detail
        console.log(e)
        this.setData({
            show: false,
            priority: index,
            priorityText: value
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

    // 提交
    async submitInform() {


        const { _id, title, content, priority, expected_time } = this.data

        if ([title, content, priority, expected_time].some(item => item === null || item === undefined || item === '')) {
            toast({
                title: '数据有误',
                mask: false
            })
            return
        }

        if (_id) {
            const { code } = await cloud('informModify', { _id, title, content, priority, expected_time })
            if (code === 200) {
                wx.navigateBack()
                toast({
                    title: '修改成功',
                    mask: false
                })
            }
        }
        else {
            const { code } = await cloud('informPost', { title, content, priority, expected_time })

            if (code === 200) {
                wx.navigateBack()
                toast({
                    title: '发布成功',
                    mask: false
                })
            }
        }
    },

    // 取消警告
    fakeCallBack() { },
})