import React, { useEffect, useState } from 'react';

const UserProductCard = () => {
    const [products, setProducts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        fetchProducts();
        const websocket = new WebSocket('ws://localhost:8004');
        
        websocket.onopen = () => {
            console.log('Подключено к WebSocket серверу');
        };

        websocket.onmessage = (event) => {
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, []);

    const fetchProducts = async () => {
        const response = await fetch('http://localhost:8003/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: '{ products { id name price  } }'
            }),
        });
        
        const { data } = await response.json();
        setProducts(data.products);
    };

    const handleSendMessage = () => {
        if (ws) {
            ws.send(messageInput);
            setMessageInput('');
        }
    };
    
    return (
        <>
            <div>
                {products.map(product => (
                    <div key={product.id} className='product-card'>
                        <h2>{product.name}</h2>
                        <p>Цена: {product.price} руб</p>
                        {product.description && <p>{product.description}</p>}
                        {product.category && <p>Категория: {product.category}</p>}
                    </div>
                ))}
            </div>
        </>
    );
};
export default UserProductCard;