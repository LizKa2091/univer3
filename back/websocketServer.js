const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8004 });
let messageHistory = [];

wss.on('connection', (ws) => {
    console.log('Клиент подключен');
    ws.send(JSON.stringify({ type: 'history', messages: messageHistory }));
    ws.on('message', (message) => {
        console.log(`Получено сообщение: ${message}`);
        const parsedMessage = JSON.parse(message);

        messageHistory.push(parsedMessage);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    });
    ws.on('close', () => {
        console.log('Клиент отключен');
    });
});
console.log('WebSocket сервер запущен на ws://localhost:8004');