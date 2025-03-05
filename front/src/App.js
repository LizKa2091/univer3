import React, { useEffect, useState } from 'react';
import AdminProductCard from './components/AdminProductCard';
import UserProductCard from './components/UserProductCard';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const ws = new WebSocket('ws://localhost:8004');

    const isAdmin = false;

    useEffect(() => {
        ws.onmessage = (event) => {
            const parsedMessage = JSON.parse(event.data);
            if (parsedMessage.type === 'history') {
                setMessages(parsedMessage.messages);
            } 
            else {
                setMessages(prevMessages => [...prevMessages, parsedMessage]);
            }
        };
    }, []);

    const handleSendMessage = () => {
        const message = {
            text: messageInput,
            sender: isAdmin ? 'Админ' : 'Гость'
        };

        ws.send(JSON.stringify(message));
        setMessageInput('');
    };

    return (
        <div className="App">
            <h1>Каталог товаров</h1>
            <div className="product-list">
                {isAdmin ? <AdminProductCard /> : <UserProductCard />}
            </div>
            <div className="chat">
                <h2>Чат</h2>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            {msg.sender}: {msg.text}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button onClick={handleSendMessage}>Отправить</button>
            </div>
        </div>
    );
};
export default App;