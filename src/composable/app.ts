import { useAppStore } from '/@/store'
export const useApp = () => {
    const appStore = useAppStore()
    const token = computed(() => appStore.token)
    const setToken = (value: string) => {
        appStore.setToken(value)
    }
    return { token, setToken }
}