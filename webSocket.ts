import { WebSocketServer, WebSocket } from 'ws';
import config from './config/config';
import JwtHelper from './helpers/jwtHelper';
import mongoose from "mongoose";
import Message,{IMessage} from "./model/chatModel";
import {createMessage} from "./services/messageService";

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
        const { targetId, text } = message;
        console.log(`Message from ${clientId} to ${targetId}: ${text}`);

        // Save the message to the database
        const newMessage: Partial<IMessage> = ({
            senderId: clientId,
            receiverId: targetId,
            text: text,
            timestamp: new Date(),
        });

        try {
            await createMessage(newMessage);
        } catch (err) {
            console.error('Error saving message:', err);
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Failed to save message' }));
        }

        const targetWs = clients.get(targetId);
        if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({ clientId, text }));
        } else {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Target client not available or WebSocket not open' }));
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