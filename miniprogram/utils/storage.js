const setStorage = (key, data) => {
    try {
        wx.setStorageSync(key, data)
    } catch (error) {
        console.log(`==> set storage ${key} have a mistake, ${error}`)
    }
}

const getStorage = (key) => {
    try {
        const value = wx.getStorageSync(key)
        return value
    } catch (error) {
        console.log(`==> get storage ${key} have a mistake, ${error}`)
    }
}

const removeStorage = (key) => {
    try {
        wx.removeStorageSync(key)
    } catch (error) {
        console.log(`==> remove storage ${key} have a mistake, ${error}`)
    }
}

const clearStorage = () => {
    try {
        wx.clearStorageSync()
    } catch (error) {
        console.log(`==> clear storage ${key} have a mistake, ${error}`)
    }
}

const asyncSetStorage = (key, data) => {
    return new Promise((resolve) => {
        wx.setStorage({
            key,
            data,
            complete(res) {
                resolve(res)
            }
        })
    })
}

const asyncGetStorage = (key) => {

    return new Promise((resolve, reject) => {
        wx.getStorage({
            key,
            success(res) {
                resolve(res.data)
            }
        })
    })
}


// const asyncGetStorage = (key) => {
//     return new Promise((resolve, reject) => {
//         wx.getStorage({
//             key,
//             success(res) {
//                 resolve(res.data); // 只返回 data
//             },
//             fail(err) {
//                 reject(err); // 失败时 reject
//             }
//         });
//     });
// };


const asyncRemoveStorage = (key) => {
    return new Promise((resolve) => {
        wx.removeStorage({
            key,
            complete(res) {
                resolve(res)
            }
        })
    })
}

const asyncClearStorage = () => {
    return new Promise((resolve) => {
        wx.clearStorage({
            complete(res) {
                resolve(res)
            }
        })
    })
}

export {
    setStorage,
    getStorage,
    removeStorage,
    clearStorage,
    asyncSetStorage,
    asyncGetStorage,
    asyncRemoveStorage,
    asyncClearStorage
}