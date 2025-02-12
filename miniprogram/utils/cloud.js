import { toast } from '@/utils/extendApi'

const cloud = (functionName, data = {}) => {
  return new Promise((resolve, reject) => {

    wx.showLoading({ title: '加载中...' })

    wx.cloud.callFunction({
      name: functionName,
      data,
      success: res => {

        wx.hideLoading()

        // 判断返回数据
        resolve(res.result)
      },
      fail: err => {

        wx.hideLoading()

        toast({
          title: 'sth has err'
        })
        reject(`云函数调用失败：${functionName}`, err)
      }
    })
  })
}

export default cloud