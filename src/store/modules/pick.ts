import { defineStore } from 'pinia'
import { getMoney } from '/@/api'
import { useAppStore } from '/@/store'
export const usePickStore = defineStore('pick', () => {
    const appStore = useAppStore()
    const money = ref('')
    const periods = ref('')
    const getMoneyHandler = async () => {
        const res = await getMoney({ uuid: appStore.token })
        money.value = res.money || ''
        periods.value = res.periods || ''
    }
    return {
        money,
        periods,
        getMoneyHandler,
    }
})