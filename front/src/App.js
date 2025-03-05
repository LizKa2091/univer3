import React, { useEffect, useState } from 'react';
import AdminProductCard from './components/AdminProductCard';
import UserProductCard from './components/UserProductCard';
import './App.scss';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const ws = new WebSocket('ws://localhost:8004');

    const isAdmin = true;

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
        <>
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
                <div className='chat__controllers'>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className='chat__input'
                    />
                    <button onClick={handleSendMessage} className='chat__button'>Отправить</button>
                </div>
            </div>
        </>
    );
};
export default App;