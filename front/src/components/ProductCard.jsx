import React, { useEffect, useState } from 'react';

const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [currAddItemInput, setCurrAddItemInput] = useState('');
    const [editItemId, setEditItemId] = useState(null);
    const [editItemInput, setEditItemInput] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        setProducts(data);
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const newProduct = { name: currAddItemInput, price: 100, description: 'добавленный котик', category: 'cat2' };

        const response = await fetch('http://localhost:8000/api/products', {
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
        await fetch(`http://localhost:8000/api/products/${id}`, {
            method: 'DELETE',
        });
        fetchProducts();
    };

    const handleEditItem = async (id) => {
        const updatedProduct = { ...products.find(product => product.id === id), name: editItemInput };
        await fetch(`http://localhost:8000/api/products/${id}`, {
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
            <form onSubmit={handleAddItem} style={{marginTop: 20}}>
                <label htmlFor="new-product">Добавить товар:</label>
                <input type="text" onChange={handleInputChange} value={currAddItemInput} />
                <button className="add-item" type="submit">добавить товар</button>
            </form>
        </>
    );
};
export default ProductCard;