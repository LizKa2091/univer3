const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 8002;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const productsFilePath = path.join(__dirname, 'data', 'products.json');

app.get('/api/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Сервер пользователя запущен на http://localhost:${PORT}`);
});