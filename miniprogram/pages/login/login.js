// pages/login/login.js
import cloud from '@/utils/cloud'
import { setStorage } from '@/utils/storage'
import { userBehavior } from './behavior'
import { toast } from '@/utils/extendApi'

Page({
    behaviors: [userBehavior],

    /**
     * 页面的初始数据
     */
    data: {
        nickName: '',
        avatarUrl: '',
        fileID: ''
    },

    async login() {

        const res = await cloud('login')
        const { code } = res
        const { openid, nickname, avatarFileID, addresses, status, is_verified, certifications } = res.data.userInfo

        if (code === 200) {
            setStorage('openid', openid)
            setStorage('nickname', nickname)
            setStorage('avatarFileID', avatarFileID)
            setStorage('addressList', addresses)
            setStorage('status', status)
            setStorage('is_verified', is_verified)
            setStorage('certifications', certifications)

            this.setOpenid(openid)
            this.setNickname(nickname)
            this.setAvatarFileID(avatarFileID)
            this.setAddressList(addresses)
            this.setStatus(status)
            this.setIs_verified(is_verified)
            this.setCertifications(certifications)

            wx.navigateBack()

            toast({
                title: '登录成功'
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})