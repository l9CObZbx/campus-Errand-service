import { BehaviorWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/store/user'

export const userBehavior = BehaviorWithStore({
    storeBindings: {
        store: userStore,
        fields: [],
        actions: ['setOpenid', 'setNickname', 'setAvatarFileID', 'setAddressList', 'setStatus', 'setIs_verified', 'setCertifications']
    }
})