const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

// Middleware
// app.use(express.static('./public')); // Front end ainda não feito
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products Route</a>');
});
app.use('/api/v1/products', productsRouter);

// Não encontrado
app.use(notFound);

// Erro
app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to DB.');
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
}
start();