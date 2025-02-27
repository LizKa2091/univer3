import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <h2>{product.name}</h2>
            <p>Цена: {product.price} руб.</p>
            <p>{product.description}</p>
            <p>Категория: {product.category}</p>
        </div>
    );
};

export default ProductCard;