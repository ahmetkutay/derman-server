import { WebSocketServer, WebSocket } from 'ws';
import config from './config/config';
import JwtHelper from './helpers/jwtHelper';

export const initializeWebSocketServer = () => {
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
        ws.on('message', (data: WebSocket.Data) => {
            const message = JSON.parse(data.toString());
            const { targetId, text } = message;
            console.log(`Message from ${clientId} to ${targetId}: ${text}`);
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
};