const asyncWrapper = require('../middleware/asyncWrapper');
const Product = require('../models/Product');

const getAllProducts = asyncWrapper(async (req, res) => {
    // Filtros Numéricos
    const numericFilters = req.query.numericFilters;
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };

        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                req.query[field] = { [operator]: Number(value) }
            }
        });
    }

    // Caso req.query contenha 'name', transformar em um regex para busca parcial
    const nameSearch = req.query.name;
    if (nameSearch) {
        req.query.name = { $regex: nameSearch, $options: 'i' };
    }

    let query = Product.find(req.query);
    
    // Caso 'sort' não seja definido, ordenar por data de criação
    let sort = req.query.sort || 'createdAt';
    sort = sort.split(',').join(' ');
    query.sort(sort);
    
    // Caso 'fields' seja definido, aplicar ao query
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query.select(fields);
    }

    // Paginação
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Executar query e responder
    const products = await query;
    res.status(200).json({ products, nbHits: products.length });
});

module.exports = getAllProducts;