import React, { useEffect, useState } from 'react';

const UserProductCard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await fetch('http://localhost:8002/api/products');
        const data = await response.json();
        setProducts(data);
    };
    
    return (
        <>
            {products.map(product => (
                <div key={product.id} className='product-card'>
                    <h2>{product.name}</h2>
                    <p>Цена: {product.price} руб.</p>
                    <p>{product.description}</p>
                    <p>Категория: {product.category}</p>
                </div>
            ))}
        </>
    );
};
export default UserProductCard;