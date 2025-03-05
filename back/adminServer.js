const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 8001;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const productsFilePath = path.join(__dirname, 'data', 'products.json');

app.get('/', (req, res) => {
    res.send('Добро пожаловать на API магазина! Используйте /api/products для доступа к товарам.');
});

app.get('/api/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/products', (req, res) => {
    const newProducts = req.body;
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const products = JSON.parse(data);
        products.push(...newProducts);
        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.status(201).send(products);
        });
    });
});

app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        let products = JSON.parse(data);
        products = products.map(product => product.id === productId ? updatedProduct : product);
        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.send(updatedProduct);
        });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        let products = JSON.parse(data);
        products = products.filter(product => product.id !== productId);
        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.status(204).send();
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});