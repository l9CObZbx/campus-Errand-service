import { observable, action } from 'mobx-miniprogram'
import { asyncGetStorage, removeStorage } from '@/utils/storage'

export const userStore = observable({
    // count: getStorage('count') || '',
    // time: getStorage('time') || '',
    // userCount: getStorage('userCount') || '',
    // confirmCount: getStorage('confirmCount') || '',
    // informCount: getStorage('informCount') || '',
    // ordermCount: getStorage('ordermCount') || '',


    count: asyncGetStorage('count') || '',
    time: asyncGetStorage('time') || '',
    userCount: asyncGetStorage('userCount') || '',
    confirmCount: asyncGetStorage('confirmCount') || '',
    informCount: asyncGetStorage('informCount') || '',
    ordermCount: asyncGetStorage('ordermCount') || '',

    setCount: action(function (count) {
        this.count = count
    }),
    setTime: action(function (time) {
        this.time = time
    }),
    setUserCount: action(function (userCount) {
        this.userCount = userCount
    }),
    setConfirmCount: action(function (confirmCount) {
        this.confirmCount = confirmCount
    }),
    setInformCount: action(function (informCount) {
        this.informCount = informCount
    }),
    setOrdermCount: action(function (ordermCount) {
        this.ordermCount = ordermCount
    }),
    clearAdmin: action(function () {
        removeStorage("count")
        removeStorage("time")
        removeStorage("userCount")
        removeStorage("confirmCount")
        removeStorage("informCount")
        removeStorage("ordermCount")
    })
})