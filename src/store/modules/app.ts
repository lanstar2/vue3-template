import { defineStore } from 'pinia'
import { getMessage, bindUserToken, getUserInfo, sendMsg } from '/@/api'
import { IMessage, IUserInfo } from './types'
import WebSocketService from '/@/utils/websocket'

export const useAppStore = defineStore('app', () => {
    const token = ref('')
    const loadingMessage = ref(true)
    const lastId = ref('')
    const messageList = ref<IMessage[]>([])
    const unreadCount = ref(0)
    const showToast = ref(false)
    const toastText = ref('')
    const userInfo = ref<IUserInfo>()
    const setToken = (value: string) => {
        token.value = value
    }
    const ws = ref<WebSocketService | null>(null)
    const initWs = () => {
        ws.value = WebSocketService.getInstance(import.meta.env.PROD ? '/ws' : `ws://${import.meta.env.VITE_APP_API_BASE_URL.replace('https://', '')}/ws`)
    }
    const handleNewMessage = (payload: any) => {
        if (payload.type === 'msg') {
            console.log('handleNewMessage', payload)
            const { data } = payload
            if(messageBoxRef.value) {
                const container = messageBoxRef.value
                const scrollTop = container.scrollTop;
                const scrollHeight = container.scrollHeight;
                const clientHeight = container.clientHeight;
                const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
                if (!isAtBottom) {
                    unreadCount.value++
                } else {
                    toBottom(true, 'smooth')
                    unreadCount.value = 0
                }
                
            }
        }
    }
    async function getUserInfoHandler() {
        const res = await getUserInfo({
            token: token.value,
        })
        userInfo.value = res?.data || {}
    }
    async function bindUserTokenHandler(data: {
        client_id: string
    }) {
        const res = await bindUserToken({
            uid: userInfo.value?.id || 0,
            client_id: data.client_id,
        })
        ws.value?.sendCommand({
            type: 'bindUid',
            user_id: userInfo.value?.id || 0,
        })
        // console.log('bindUserTokenHandler', res)
    }
    async function getMessageHistory() {
        const res = await getMessage({
            lastId: lastId.value,
            token: token.value,
        })
        messageList.value = res?.data || []
        loadingMessage.value = false
    }
    const messageBoxRef = ref<HTMLElement>()
    const setMessageBoxRef = (element: HTMLElement) => {
        messageBoxRef.value = element
    }
    const toBottom = (force: boolean = false, behaviorType: ScrollBehavior = 'instant') => {
        const element = messageBoxRef.value;
        if (!element) return;
        const distanceToBottom = element.scrollHeight - element.clientHeight - element.scrollTop;
        if (!force && distanceToBottom > 500) {
            return;
        }
        const maxScrollTop = element.scrollHeight - element.clientHeight;
        element.scrollTo({
            top: maxScrollTop,
            behavior: behaviorType
        });
    }
    const pingTimer = ref()
    const pingHandler = () => {
        ws.value?.sendCommand({
            type: 'ping',
        })
    }
    const sendMsgHandler = async (data: {
        msg: string
    }) => {
        const res = await sendMsg({
            token: token.value,
            msg: data.msg,
        })
        console.log('sendMsgHandler', res)
        autoCheckScrollToBottom()
    }
    const autoCheckScrollToBottom = (force: boolean = false) => {
        window.requestAnimationFrame(() => {
            toBottom(force);
        });
    }
    return {
        ws,
        pingTimer,
        sendMsgHandler,
        bindUserTokenHandler,
        initWs,
        token,
        toBottom,
        setToken,
        loadingMessage,
        getMessageHistory,
        messageList,
        setMessageBoxRef,
        handleNewMessage,
        userInfo,
        getUserInfoHandler,
        pingHandler,
        autoCheckScrollToBottom,
        showToast,
        toastText,
        unreadCount,
    }
})
