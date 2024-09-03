import { WebSocketServer, WebSocket } from 'ws';
import config from './config/config';
import JwtHelper from './helpers/jwtHelper';
import mongoose from "mongoose";
import Message, { IMessage } from "./model/chatModel";
import { createMessage, deleteMessage, updateMessage } from "./services/messageService";

const mongoUriWebSocket: string = config.database.mongodb.dsn as unknown as string;

if (!mongoUriWebSocket) {
    throw new Error('MongoDB URI is not defined in the environment variables.');
}

mongoose.connect(mongoUriWebSocket).then(() => {
    console.log('Connected to MongoDB');
}).catch((error: Error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// Initialize WebSocket server
const port = config.webSocket.port;
const wss = new WebSocketServer({ port });
const jwtHelper = new JwtHelper();
const clients: Map<string, WebSocket> = new Map();

wss.on('connection', (ws: WebSocket, request) => {
    const token = new URLSearchParams(request.url?.split('?')[1]).get('token');
    if (!token) {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Token not provided' }));
        ws.close();
        return;
    }

    let user: { userId: string } | null = null;
    try {
        user = jwtHelper.extractTokenVariables(token as string) as { userId: string };
    } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid token' }));
        ws.close();
        return;
    }

    const clientId = user?.userId;
    if (!clientId) {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid user' }));
        ws.close();
        return;
    }

    clients.set(clientId, ws);
    console.log(`Client ${clientId} connected`);

    // @ts-ignore
    ws.on('message', async (data: WebSocket.Data) => {
        const message = JSON.parse(data.toString());
        const { type, messageId, targetId, text } = message;

        if (type === 'CREATE_MESSAGE') {
            // Save the message to the database
            const newMessage: Partial<IMessage> = {
                senderId: clientId,
                receiverId: targetId,
                text: text,
                timestamp: new Date(),
            };

            try {
                const savedMessage = await createMessage(newMessage);
                // Notify the receiver
                const targetWs = clients.get(targetId);
                if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                    targetWs.send(JSON.stringify({ type: 'MESSAGE_CREATED', message: savedMessage }));
                } else {
                    ws.send(JSON.stringify({ type: 'ERROR', message: 'Target client not available or WebSocket not open' }));
                }
            } catch (err) {
                console.error('Error saving message:', err);
                ws.send(JSON.stringify({ type: 'ERROR', message: 'Failed to save message' }));
            }

        } else if (type === 'UPDATE_MESSAGE') {
            // Update the message in the database
            try {
                const updatedMessage = await updateMessage(messageId, { text });
                // Notify the sender and receiver about the update
                [clientId, targetId].forEach(id => {
                    const clientWs = clients.get(id);
                    if (clientWs && clientWs.readyState === WebSocket.OPEN) {
                        // @ts-ignore
                        clientWs.send(JSON.stringify({ type: 'MESSAGE_UPDATED', messageId, text: updatedMessage.text }));
                    }
                });
            } catch (err) {
                console.error('Error updating message:', err);
                ws.send(JSON.stringify({ type: 'ERROR', message: 'Failed to update message' }));
            }

        } else if (type === 'DELETE_MESSAGE') {
            // Delete the message from the database
            try {
                await deleteMessage(messageId);
                // Notify the sender and receiver about the deletion
                [clientId, targetId].forEach(id => {
                    const clientWs = clients.get(id);
                    if (clientWs && clientWs.readyState === WebSocket.OPEN) {
                        clientWs.send(JSON.stringify({ type: 'MESSAGE_DELETED', messageId }));
                    }
                });
            } catch (err) {
                console.error('Error deleting message:', err);
                ws.send(JSON.stringify({ type: 'ERROR', message: 'Failed to delete message' }));
            }

        } else {
            console.log(`Unhandled message type: ${type}`);
        }
    });

    ws.on('close', () => {
        clients.delete(clientId);
        console.log(`Client ${clientId} disconnected`);
    });

    ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error.message);
    });
});

console.log(`WebSocket server running on ws://localhost:${port}`);
