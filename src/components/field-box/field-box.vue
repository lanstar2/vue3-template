<template>
    <div class="field-box">
        <i :style="{ color: activePanel === 2 ? 'orange' : '' }" :class="`iconfont icon-jianpan2`"
            @click.stop="handlePanelToggle(2)" class="iconfont icon-jianpan2 field-icon"></i>
        <div class="field-container">
            <div class="adm-text-area">
                <textarea class="adm-text-area-element" @input="autoResize" rows="1" @focus="handleFocus"
                    @blur="handleBlur" v-model="inputValue"></textarea>
            </div>
        </div>
        <div @click="showMartingaleBetting = true" class="button-item double">
            <div>倍投</div>
        </div>
        <div class="button-item">
            <div @click="handleSend">{{ inputValue ? '发送' : '快选' }}</div>
        </div>
        <i class="iconfont icon-tianjia field-icon"></i>
    </div>
    <keyboard-panel v-if="activePanel === 2" @keyboard-click="handleKeyboardClick" />
    <martingale-betting v-model="showMartingaleBetting" @confirm="showMartingaleBetting = false" />
</template>

<script setup lang="ts">
import { useAppStore } from '/@/store';
import { useModal } from 'vue-final-modal'
import { useRouter } from 'vue-router'
const appStore = useAppStore()
const props = defineProps<{
    visible?: boolean
}>()
const activePanel = ref(0)
const focusState = ref(0)
const inputValue = ref('')
const showMartingaleBetting = ref(false)
function handlePanelToggle(panel: number) {
    if (activePanel.value === panel) {
        activePanel.value = 0
        return
    }
    if (panel === 2) {
        setTimeout(() => {
            appStore.toBottom(true, 'instant')
        }, 10)
    }
    activePanel.value = panel
}
const handleKeyboardClick = (action: string, value?: string) => {
    switch (action) {
        case 'delete':
            if (inputValue.value) {
                inputValue.value = inputValue.value.slice(0, -1)
            }
            break
        case 'remove':
            if (inputValue.value) {
                inputValue.value = ''
            }
            break
        case 'add':
            inputValue.value = inputValue.value + value
            break
    }
}
const handleFocus = () => {
    focusState.value = 1
}
const handleBlur = () => {
    focusState.value = 0
}
const autoResize = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement
    const computedStyle = window.getComputedStyle(textarea)
    const lineHeight = parseInt(computedStyle.lineHeight, 10) || 24
    const maxHeight = lineHeight * 8
    textarea.style.height = 'auto'
    textarea.style.maxHeight = `${maxHeight}px`
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
}
const router = useRouter()
// Navigate to pick page with proper flag set
const navigateToPick = async () => {
    // Set flag in localStorage to indicate navigation from main page
    localStorage.setItem('fromMainPage', 'true');
    // Navigate to pick page
    await appStore.autoCheckScrollToBottom(true)
    router.push({ name: 'pick', query: { token: appStore.token } })
}
const handleSend = () => {
    if (!inputValue.value) {
        // 打开快选
        navigateToPick()
        return
    }
    appStore.sendMsgHandler({
        msg: inputValue.value
    })
    inputValue.value = ''
}
</script>

<style scoped></style>