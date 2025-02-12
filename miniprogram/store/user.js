import { observable, action, get } from 'mobx-miniprogram'
import { asyncGetStorage, getStorage } from '@/utils/storage'

export const userStore = observable({
    // 属性
    // openid: getStorage('openid') || '',
    // nickname: getStorage('nickname') || '',
    // avatarFileID: getStorage('avatarFileID') || '',
    // addressList: getStorage('addressList') || '',
    // status: getStorage('status') ?? '',
    // is_verified: getStorage('is_verified') ?? '',
    // certifications: getStorage('certifications') || '',


    // openid: asyncGetStorage('openid') || '',
    // nickname: asyncGetStorage('nickname') || '',
    // avatarFileID: asyncGetStorage('avatarFileID') || '',
    // addressList: asyncGetStorage('addressList') || '',
    // status: asyncGetStorage('status') ?? '',
    // is_verified: asyncGetStorage('is_verified') ?? '',
    // certifications: asyncGetStorage('certifications') || '',


    openid: '',
    nickname: '',
    avatarFileID: '',
    addressList: '',
    status: '',
    is_verified: '',
    certifications: '',

    // 异步加载数据
    async loadUserData() {
        try {
            const [
                openid,
                nickname,
                avatarFileID,
                addressList,
                status,
                is_verified,
                certifications
            ] = await Promise.all([
                asyncGetStorage('openid'),
                asyncGetStorage('nickname'),
                asyncGetStorage('avatarFileID'),
                asyncGetStorage('addressList'),
                asyncGetStorage('status'),
                asyncGetStorage('is_verified'),
                asyncGetStorage('certifications')
            ]);

            // 使用 action 来直接更新 observable 的状态
            this.setOpenid(openid || '');
            this.setNickname(nickname || '');
            this.setAvatarFileID(avatarFileID || '');
            this.setAddressList(addressList || '');
            this.setStatus(status ?? '');
            this.setIs_verified(is_verified ?? '');
            this.setCertifications(certifications || '');
        } catch (error) {
            console.error("加载用户数据失败", error);
        }
    },

    // 在初始化时自动加载数据
    initialize() {
        this.loadUserData();
    },







    // 方法
    setOpenid: action(function (openid) {
        this.openid = openid
    }),
    setNickname: action(function (nickname) {
        this.nickname = nickname
    }),
    setAvatarFileID: action(function (avatarFileID) {
        this.avatarFileID = avatarFileID
    }),
    setAddressList: action(function (addressList) {
        this.addressList = addressList
    }),
    setStatus: action(function (status) {
        this.status = status
    }),
    setIs_verified: action(function (is_verified) {
        this.is_verified = is_verified
    }),
    setCertifications: action(function (certifications) {
        this.certifications = certifications
    })
})


// 初始化时调用 loadUserData
userStore.initialize();