<template>
    <div class="keyboard">
        <div v-for="item in keyboardList" :key="item" :class="{
            'delete': item === '←',
            'newline': item === '换行',
        }" class="keyboard-item" @click="handleKeyboardClick(item)">
            {{ item }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '/@/store';
const appStore = useAppStore()
const keyboardList = ["查", "上", "下", "二", "三", "四", "定", "现", "←", "奖", "大", "千", "1", "2", "3", "除", "双重", "兄弟", "走", "小", "百", "4", "5", "6", "取", "三重", "两", "倒", "单", "十", "7", "8", "9", "。", "四重", "清除", "全", "双", "个", "0", ".", "X", "各", "合", "换行"];
const emit = defineEmits<{
    (e: 'keyboardClick', value: string, num?: string): void
}>()
const handleKeyboardClick = (item: string) => {
    switch (item) {
        case '查':
            appStore.sendMsgHandler({
                msg: item,
            })
            break
        case '←':
            emit('keyboardClick', 'delete')
            break
        case '大':
            emit('keyboardClick', 'add', '56789')
            break
        case '小':
            emit('keyboardClick', 'add', '01234')
            break
        case '单':
            emit('keyboardClick', 'add', '13579')
            break
        case '双':
            emit('keyboardClick', 'add', '24680')
            break
        case '全':
            emit('keyboardClick', 'add', '0123456789')
            break
        case '清除':
            emit('keyboardClick', 'remove')
            break
        case '换行':
            emit('keyboardClick', 'newline')
            break
        default:
            emit('keyboardClick', 'add', item)
    }
    // appStore.ws?.sendCommand({
    //     type: 'sendMsg',
    //     msg: item,
    // })
    // emit('keyboardClick', item)
}
</script>

<style scoped></style>