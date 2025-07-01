<template>
    <VueFinalModal class="flex justify-center items-center"
        content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2">
        <div class="md-popup-box">
            <div class="md-dialog-content">
                <div class="md-dialog-body">
                    <div class="flex items-center justify-center mb-4">
                        <a role="button" class="md-dialog-close h-7 flex items-center justify-center"
                            @click="emit('confirm')">
                            <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                            </svg>
                        </a>
                        <h2 class="md-dialog-title flex-1 inline-flex items-center justify-center">定投</h2>
                    </div>
                    <div class="smartbet">
                        <div class="content">
                            <div class="box">
                                <!-- TODO: 倍投内容 等开发完快选后，再修改-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useAppStore } from '/@/store'
const appStore = useAppStore()
const emit = defineEmits<{
    (e: 'confirm'): void
}>()
</script>

<style scoped lang="scss">
.smartbet {
    width: 100%;
    background-color: rgba(50, 50, 50, 0.8);

    .content {
        background-color: #f6f6f6;
        width: 100%;
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
    }
}
</style>