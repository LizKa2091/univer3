import React from 'react';
import ProductCard from './components/ProductCard';

const App = () => {
    return (
        <div className="App">
            <h1>Каталог товаров</h1>
            <div className="product-list">
                <ProductCard />
            </div>
        </div>
    );
};
export default App;