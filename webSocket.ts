import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import config from "./config/config";

export const initializeWebSocketServer = () => {
    const port = config.webSocket.port;
    const wss = new WebSocketServer({ port });

    const clients: Map<string, WebSocket> = new Map();
    const chatRooms: Map<string, { user1: string, user2: string }> = new Map();
    const userSockets: Map<string, string> = new Map();

    wss.on('connection', (ws: WebSocket) => {
        const clientId = uuidv4();
        clients.set(clientId, ws);
        ws.send(JSON.stringify({ type: 'WELCOME', id: clientId }));

        ws.on('message', (message: WebSocket.MessageEvent) => {
            try {
                const parsedMessage = JSON.parse(message.toString());

                if (parsedMessage.type === 'SET_USER_ID') {
                    userSockets.set(parsedMessage.userId, clientId);
                    ws.send(JSON.stringify({ type: 'USER_ID_SET', userId: parsedMessage.userId }));
                } else if (parsedMessage.type === 'JOIN_CHAT') {
                    chatRooms.set(parsedMessage.chatRoomId, {
                        user1: parsedMessage.user1Id,
                        user2: parsedMessage.user2Id
                    });
                } else if (parsedMessage.type === 'PRIVATE_MESSAGE') {
                    const { chatRoomId, fromId, message: chatMessage } = parsedMessage;
                    const chatRoom = chatRooms.get(chatRoomId);

                    if (chatRoom) {
                        const targetClientId = [chatRoom.user1, chatRoom.user2].find(id => id !== fromId);
                        const targetClient = userSockets.get(targetClientId as string);

                        if (targetClient) {
                            const targetWs = clients.get(targetClient);
                            if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                                targetWs.send(JSON.stringify({
                                    type: 'PRIVATE_MESSAGE',
                                    fromId,
                                    message: chatMessage
                                }));
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        ws.on('close', () => {
            const clientIdToRemove = [...clients.entries()].find(([id, socket]) => socket === ws)?.[0];
            if (clientIdToRemove) {
                clients.delete(clientIdToRemove);
                userSockets.forEach((value, key) => {
                    if (value === clientIdToRemove) {
                        userSockets.delete(key);
                    }
                });
                chatRooms.forEach((value, key) => {
                    if (value.user1 === clientIdToRemove || value.user2 === clientIdToRemove) {
                        chatRooms.delete(key);
                    }
                });
            }
        });

        ws.on('error', (error: Error) => {
            console.error('WebSocket error:', error.message);
        });
    });

    console.log(`WebSocket service running on ws://localhost:${port}`);
};