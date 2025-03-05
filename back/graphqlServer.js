const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const productsFilePath = path.join(__dirname, 'data', 'products.json');

const schema = buildSchema(`
    type Product {
        id: Int
        name: String
        price: Float
        description: String
        category: String
    }
    type Query {
        products: [Product]
    }
`);

const root = {
    products: () => {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(data);
    }
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const PORT = 8003;
app.listen(PORT, () => {
    console.log(`GraphQL сервер запущен на http://localhost:${PORT}/graphql`);
});