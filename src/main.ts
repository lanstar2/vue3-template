import { createApp } from 'vue'
import App from './App.vue'
// 引入 vue-router
import router from './router'
// 引入 pinia
import { useUserStore } from './store'
import store from './store'
import './assets/css/index.css'
import 'animate.css'
const app = createApp(App).use(store)

// 获取基础数据
await useUserStore().getData()

app.use(router).mount('#app')
