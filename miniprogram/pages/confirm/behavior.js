import { BehaviorWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/store/user'

export const userBehavior = BehaviorWithStore({
    storeBindings: {
        store: userStore,
        fields: ['openid', 'certifications', 'is_verified'],
        actions: ['setCertifications', 'setIs_verified']
    }
})