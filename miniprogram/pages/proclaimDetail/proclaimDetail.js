Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        expected_time: '',
        content: ''
    },

    onLoad(options) {
        const { title, expected_time, content } = options
        this.setData({
            title, expected_time, content
        })
    }
})