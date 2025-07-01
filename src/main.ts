import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import VueVirtualScroller from 'vue-virtual-scroller'
import App from './App.vue'
// 引入 vue-router
import router from './router'
// 引入 pinia
import Copy from "vue3-copy";
import { useAppStore } from './store'
import store from './store'
import './assets/css/index.css'
import './assets/css/reset.css'
import 'animate.css'
import 'vue-final-modal/style.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
const app = createApp(App).use(store)
const vfm = createVfm()
// 获取基础数据
// await useUserStore().getData()

app.use(router).use(Copy).use(vfm).use(VueVirtualScroller)
router.isReady().then(() => {
    console.log('router is ready: ', router.currentRoute.value)
    const route = router.currentRoute.value
    if (!route?.query?.token) {
     router.push('/error')
    }
    useAppStore().setToken(route.query.token as string)
    app.mount('#app')
})
