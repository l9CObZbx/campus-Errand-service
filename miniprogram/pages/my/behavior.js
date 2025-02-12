import { BehaviorWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/store/user'

export const userBehavior = BehaviorWithStore({
    storeBindings: {
        store: userStore,
        fields: ['openid', 'nickname', 'avatarFileID', 'status', 'is_verified'],
        actions: ['setStatus', 'setIs_verified', 'setCertifications']
    }
})