<template>
    <div class="message-item" :class="{ 'message-item-right': isSelf }">
        <img :src="avatarUrl" class="avatar" />
        <div class="message-main">
            <div class="nick">{{  item.name }}</div>
            <div :class="{'chat-out': isSelf, 'chat-in': !isSelf}" class="chat-bubble">
                <template v-if="item.fromUser == null && !item.fromId">
                    <pre v-if="item.msgType === 0" class="pre-item" v-html="item.content"></pre>
                </template>
                <template v-else>
                    <pre v-copy="item.content" v-copy:callback="handleCopied" v-if="item.msgType === 0" class="pre-item" v-html="item.content"></pre>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '/@/store';
import { IMessage } from '/@/store/modules/types'
const appStore = useAppStore()
const props = defineProps<{
    item: IMessage
}>()
const isSelf = computed(() => {
    return props.item.fromId === appStore.userInfo?.id
})
const avatarUrl = computed(() => {
    return props.item.imgUrl.indexOf('http') === 0 ? props.item.imgUrl : `${import.meta.env.VITE_APP_API_BASE_URL}${props.item.imgUrl}`
})
const handleCopied = (text: string) => {
    console.log('handleCopied', text)
    appStore.showToast = true
    appStore.toastText = '复制成功'
    setTimeout(() => {
        appStore.showToast = false
    }, 2500)
}
</script>

<style scoped></style>