import React, { useEffect, useState } from 'react';

const AdminProductCard = () => {
    const [products, setProducts] = useState([]);
    const [currAddItemInput, setCurrAddItemInput] = useState('');
    const [editItemId, setEditItemId] = useState(null);
    const [editItemInput, setEditItemInput] = useState('');
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
                query: '{ products { id name price description category } }'
            }),
        });

        const { data } = await response.json();
        setProducts(data.products);
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const newProduct = { name: currAddItemInput, price: 100, description: 'добавленный котик', category: 'cat2' };
        const response = await fetch('http://localhost:8001/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([newProduct]),
        });
        if (response.ok) {
            setCurrAddItemInput('');
            fetchProducts();
        }
    };

    const handleRemoveItem = async (id) => {
        await fetch(`http://localhost:8001/api/products/${id}`, {
            method: 'DELETE',
        });
        fetchProducts();
    };

    const handleEditItem = async (id) => {
        const updatedProduct = { ...products.find(product => product.id === id), name: editItemInput };

        await fetch(`http://localhost:8001/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });

        setEditItemId(null);
        setEditItemInput('');
        fetchProducts();
    };

    const handleSendMessage = () => {
        if (ws) {
            ws.send(messageInput);
            setMessageInput('');
        }
    };

    const handleInputChange = (e) => {
        setCurrAddItemInput(e.target.value);
    };

    const handleEditInputChange = (e) => {
        setEditItemInput(e.target.value);
    };
    
    return (
        <>
            {products.map(product => (
                    <div key={product.id} className='product-card'>
                        <h2>{product.name}</h2>
                        <p>Цена: {product.price} руб.</p>
                        <p>{product.description}</p>
                        <p>Категория: {product.category}</p>
                        <button className="remove-item" onClick={() => handleRemoveItem(product.id)}>удалить товар</button>
                        {editItemId === product.id ? (
                            <>
                                <input type="text" onChange={handleEditInputChange} value={editItemInput} />
                                <button className="edit-item" onClick={() => handleEditItem(product.id)}>сохранить изменения</button>
                            </>
                        ) : (
                            <button className="edit-item" onClick={() => { setEditItemId(product.id); setEditItemInput(product.name); }}>изменить товар</button>
                        )}
                    </div>
            ))}
            <form onSubmit={handleAddItem} className='add-item__form'>
                <label htmlFor="new-product" className='add-item__label'>Добавить товар:</label>
                <input type="text" onChange={handleInputChange} value={currAddItemInput} className='add-item__input'/>
                <button className="add-item add-item__button" type="submit">добавить товар</button>
            </form>
        </>
    );
};
export default AdminProductCard;