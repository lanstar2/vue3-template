// 定义消息类型接口
interface WebSocketMessage {
    id?: string;
    type?: string;
    additionalProperties?: {
        action: string;
    };
    data?: any;
    [key: string]: any;
}

// 定义命令类型
interface WebSocketCommand {
    action?: string;
    lastId?: string;
    minId?: string;
    [key: string]: any;
}

// 定义回调函数类型
type MessageCallback = (data: any) => void;

// 定义监听器类型映射
interface ListenersMap {
    [eventType: string]: MessageCallback[];
}

/**
 * websocket 服务
 * TODO: 开发中
 */
class WebSocketService {
    private static instance: WebSocketService | null = null;

    private ws!: WebSocket;
    private listeners: ListenersMap = {};
    private minId: string = "";
    public receivedMessageIds: Set<string> = new Set();
    private cleanupInterval: number = 300000; // 5分钟
    private maxMessageIds: number = 1000;
    private cleanupTimeoutId: number | null = null;
    private url: string;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectInterval: number = 3000;
    private reconnectTimeoutId: number | null = null;
    private isConnecting: boolean = false;

    constructor(url: string) {
        this.url = url;
        this.setupVisibilityListener();
        this.setupMessageIdCleanup();
        this.connect();
    }

    private connect(): void {
        if (this.isConnecting) {
            console.log("WebSocket正在连接中，跳过重复连接");
            return;
        }

        console.log("开始建立WebSocket连接 - URL:", this.url);
        this.isConnecting = true;
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = this.handleMessage.bind(this);
        this.ws.onopen = this.handleOpen.bind(this);
        this.ws.onerror = this.handleError.bind(this);
        this.ws.onclose = this.handleClose.bind(this);
    }

    static getInstance(url?: string): WebSocketService {
        if (WebSocketService.instance) {
            if (url && WebSocketService.instance.url !== url) {
                WebSocketService.instance.close();
                WebSocketService.instance = new WebSocketService(url);
            }
        } else {
            if (!url) {
                throw new Error("WebSocketService instance has not been created yet. Please provide a URL.");
            }
            WebSocketService.instance = new WebSocketService(url);
        }
        return WebSocketService.instance;
    }

    sendCommand(command: WebSocketCommand | string): void {
        if (this.ws.readyState === WebSocket.OPEN) {
            try {
                // 发送消息
                  const message = typeof command === "string" ? command : JSON.stringify(command);
                //   const encryptedMessage = $f.encrypt(message);
                  this.ws.send(message);
            } catch (error) {
                console.error("发送消息时发生错误:", error);
                if (this.ws.readyState !== WebSocket.OPEN) {
                    this.reconnect();
                }
            }
        } else {
            console.error("WebSocket未连接，无法发送消息。当前状态:", this.ws.readyState);
        }
    }

    subscribe(eventType: string, callback: MessageCallback): void {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }

    unsubscribe(eventType: string, callback: MessageCallback): void {
        if (this.listeners[eventType]) {
            const index = this.listeners[eventType].indexOf(callback);
            if (index !== -1) {
                this.listeners[eventType].splice(index, 1);
            }
        }
    }

    private handleMessage(event: MessageEvent): void {
        const decryptedData = event.data;
        // console.log('message', decryptedData)
        try {
            const message: WebSocketMessage = JSON.parse(decryptedData);
            if (message.type === 'init') {
                this.triggerCallbacks("init", message);
            }
            if (message.data && message.data.id && message.type !== 'isOnline') {
                if (this.receivedMessageIds.has(message.data.id)) {
                    console.log("跳过重复消息:", message.data.id);
                    return;
                }

                if (!this.minId || message.data.id > this.minId) {
                    this.minId = message.data.id;
                }
                this.receivedMessageIds.add(message.data.id);
            }

            if (message.additionalProperties) {
                if (message.additionalProperties.action === "pull") {
                    this.triggerCallbacks("pull", message.data);
                } else if (message.additionalProperties.action === "last10") {
                    this.triggerCallbacks("last", message.data);
                }
            } else {
                this.triggerCallbacks("msg", message);
            }
        } catch (error) {
            console.error("解析消息失败:", error);
            this.triggerCallbacks("msg", event.data);
        }
    }

    private triggerCallbacks(eventType: string, data: any): void {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(callback => {
                callback(data);
            });
        }
    }

    private setupVisibilityListener(): void {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible" &&
                this.ws.readyState !== WebSocket.OPEN) {
                this.reconnect();
            }
        });
    }

    private reconnect(): void {
        console.log("开始重新连接WebSocket");

        if (this.ws) {
            if (this.ws.readyState === WebSocket.OPEN ||
                this.ws.readyState === WebSocket.CONNECTING) {
                console.log("关闭现有连接以准备重连");
                this.ws.close();
            }

            this.ws.onmessage = null;
            this.ws.onopen = null;
            this.ws.onerror = null;
            this.ws.onclose = null;
        }

        this.isConnecting = false;
        this.connect();
    }

    private handleOpen(): void {
        console.log("WebSocket已连接 - URL:", this.url);
        this.isConnecting = false;

        if (this.reconnectTimeoutId) {
            window.clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = null;
        }

        if (this.reconnectAttempts > 0) {
            console.log("重连成功，拉取未接收的消息，minId:", this.minId);
            this.sendCommand({
                action: "pull",
                lastId: "",
                minId: this.minId
            });
        } else {
            this.sendCommand({
                action: "pull",
                lastId: ""
            });
            this.receivedMessageIds.clear();
        }

        this.reconnectAttempts = 0;
    }

    private handleError(event: Event): void {
        console.error("WebSocket error:", event);
        console.debug("WebSocket error details:", {
            readyState: this.ws.readyState,
            url: this.url,
            reconnectAttempts: this.reconnectAttempts
        });
    }

    private handleClose(): void {
        console.log("WebSocket已断开连接 - URL:", this.url);

        if (this.isConnecting || this.reconnectTimeoutId) {
            console.log("已经在连接中或存在重连计划，跳过重连");
            return;
        }

        if (this.ws.readyState === WebSocket.CLOSING ||
            this.ws.readyState === WebSocket.CLOSED) {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
                console.log(`准备第${this.reconnectAttempts + 1}次重连，等待时间：${delay}ms`);

                this.reconnectTimeoutId = window.setTimeout(() => {
                    if (WebSocketService.instance === this) {
                        console.log(`开始第${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}次重连尝试`);
                        this.reconnectAttempts++;
                        this.reconnectTimeoutId = null;
                        this.connect();
                    } else {
                        console.log("实例已更新，取消重连");
                        this.reconnectTimeoutId = null;
                    }
                }, delay);
            } else {
                console.log("达到最大重连次数，停止重连");
            }
        } else {
            console.log("WebSocket状态异常，当前状态:", this.ws.readyState);
        }
    }

    private setupMessageIdCleanup(): void {
        this.cleanupTimeoutId = window.setInterval(() => {
            if (this.receivedMessageIds.size > this.maxMessageIds) {
                const sortedIds = Array.from(this.receivedMessageIds).sort();
                const idsToDelete = sortedIds.slice(0, sortedIds.length - this.maxMessageIds);
                idsToDelete.forEach(id => this.receivedMessageIds.delete(id));
                console.log(`已清理${idsToDelete.length}条过旧的消息ID`);
            }
        }, this.cleanupInterval);
    }

    close(): void {
        if (this.reconnectTimeoutId) {
            window.clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = null;
        }

        if (this.cleanupTimeoutId) {
            window.clearInterval(this.cleanupTimeoutId);
            this.cleanupTimeoutId = null;
        }

        this.isConnecting = false;
        this.reconnectAttempts = 0;

        if (this.ws) {
            this.ws.close();
        }
    }
}

export default WebSocketService;