<script setup lang="ts">
import { useAppStore } from '/@/store'
const appStore = useAppStore()
const { token, setToken } = appStore
const router = useRouter()
const route = useRoute()
const query = route.query as { token: string }
const loadingMessage = computed(() => appStore.loadingMessage)
const messageBoxRef = ref<HTMLElement>()
const messageList = computed(() => appStore.messageList)
const showToast = computed(() => appStore.showToast)
const toastText = computed(() => appStore.toastText)
const unreadCount = computed(() => appStore.unreadCount)
const scroller = ref()
// WebSocket 消息处理函数
// const handleNewMessage = (data: any) => {
//     console.log('收到新消息:', data)
//     // 处理新消息，比如添加到消息列表
//     if (data && Array.isArray(data)) {
//         appStore.messageList.push(...data)
//         // 滚动到底部
//         nextTick(() => {
//             appStore.toBottom(messageBoxRef.value!, true)
//         })
//     }
// }

// const handlePullMessage = (data: any) => {
//     console.log('收到拉取消息:', data)
//     // 处理拉取的历史消息
//     if (data && Array.isArray(data)) {
//         appStore.messageList.unshift(...data)
//     }
// }

// const handleLastMessage = (data: any) => {
//     console.log('收到最后10条消息:', data)
//     // 处理最后10条消息
//     if (data && Array.isArray(data)) {
//         appStore.messageList = data
//         nextTick(() => {
//             appStore.toBottom(messageBoxRef.value!, true)
//         })
//     }
// }


onActivated(() => {
    console.log('onActivated')
    appStore.toBottom(true, 'instant')
})
onMounted(async () => {
    if (!query.token) {
        router.push('/error')
    }
    console.log('token', query.token)
    setToken(query.token)
    nextTick(async () => {

        if (messageBoxRef.value) {
            appStore.setMessageBoxRef(messageBoxRef.value)
        }
        await appStore.getUserInfoHandler()
        await appStore.initWs()
        await appStore.getMessageHistory()
        await nextTick() // 等待 DOM 渲染
        appStore.autoCheckScrollToBottom(true)

        // 订阅 WebSocket 事件
        if (appStore.ws) {
            // 订阅websocket事件
            appStore.ws.subscribe('init', appStore.bindUserTokenHandler)
            appStore.ws.subscribe('msg', appStore.handleNewMessage)
            // 定时ping
            // appStore.pingTimer = setInterval(() => {
            //     appStore.pingHandler()
            // }, 10000)
        }
    })
})

watch(messageList, async (newValue, oldValue) => {
    await nextTick()
    if (oldValue?.length && oldValue.length < newValue.length) {
        appStore.autoCheckScrollToBottom()
    }
}, { deep: true, immediate: true })


// 组件卸载时取消订阅
onUnmounted(() => {
    if (appStore.ws) {
        appStore.ws.unsubscribe('init', appStore.bindUserTokenHandler)
        // appStore.ws.unsubscribe('msg', handleNewMessage)
        // appStore.ws.unsubscribe('pull', handlePullMessage)
        // appStore.ws.unsubscribe('last', handleLastMessage)
    }
    if (appStore.pingTimer) {
        clearInterval(appStore.pingTimer)
    }
    // appStore.loadingMessage = true
})
</script>
<template>
    <div class="flex flex-col min-h-screen">
        <div class="ak-wrapper">
            <div class="ak-content">
                <div class="home-container">
                    <div v-show="loadingMessage" class="loading-container">
                        <div class="loading-item delay-1"></div>
                        <div class="loading-item delay-2"></div>
                        <div class="loading-item delay-3"></div>
                    </div>
                    <div class="message-wrap">
                        <div ref="messageBoxRef" class="message-box">
                            <DynamicScroller ref="scroller" :items="messageList" :min-item-size="54" class="scroller">
                                <template #default="{ item, index, active }">
                                    <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[
                                        item.message,
                                    ]" :data-index="index" :data-active="active"
                                        :title="`Click to change message ${index}`" class="message" @click="">
                                        <message-item :item="item" />
                                    </DynamicScrollerItem>
                                </template>
                            </DynamicScroller>
                        </div>
                        <div v-if="unreadCount > 0" class="unread-container">
                            <i class="iconfont icon-down"></i> <span>{{ unreadCount }}条新消息</span>
                        </div>
                        <div class="scratch-img">
                            <img class="scratch-img-item" src="/@/assets/mi.jpg" alt="">
                        </div>
                    </div>
                    <field-box />
                </div>
            </div>
        </div>
    </div>
    <teleport to="body">
        <div v-if="showToast">
            <div class="adm-mask adm-toast-mask" aria-hidden="true"
                style="pointer-events: none; background: rgba(0, 0, 0, 0); opacity: 1;">
                <div class="adm-mask-content">
                    <div class="adm-toast-wrap">
                        <div class="adm-toast-main adm-toast-main-text" style="top: 50%;">
                            <div class="adm-auto-center">
                                <div class="adm-auto-center-content">{{ toastText }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>
<style scoped lang="scss"></style>
