import React from 'react';
import AdminProductCard from './components/AdminProductCard';
import UserProductCard from './components/UserProductCard';

const App = () => {
    const isAdmin = false;
    return (
        <div className="App">
            <h1>Каталог товаров</h1>
            <div className="product-list">
                {isAdmin ? <AdminProductCard /> : <UserProductCard />}
            </div>
        </div>
    );
};

export default App;