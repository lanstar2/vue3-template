<template>
    <div class="fixed inset-0 flex flex-col">
        <div class="fixed inset-0">
            <div class="h-[1.49rem] bg-[#fb5924] text-center relative">
                <div class="pick-title">英国幸运五</div>
                <div class="balance">{{ pickStore.periods || '--' }}期 可用余额：{{ pickStore.money || '0' }}</div>
                <i @click="closePick" class="iconfont icon-close pick-close"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '/@/store';
import { usePickStore } from '/@/store/modules/pick';
const appStore = useAppStore();
const pickStore = usePickStore();
const router = useRouter();

onMounted(async () => {
    // Get the navigation type from history state or localStorage
    const fromMainPage = localStorage.getItem('fromMainPage') === 'true';
    
    // If not navigated from main page, redirect to error
    if (!fromMainPage) {
        router.replace({name: 'main', query: { token: appStore.token }});
    }
    
    // 重置flag
    // localStorage.removeItem('fromMainPage');

    pickStore.getMoneyHandler()
});
const closePick = () => {
    router.push({name: 'main', query: { token: appStore.token }})
}
</script>

<style scoped>

</style>