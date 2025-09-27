
const { getPool, sql } = require('../../DbConnection/mssqlConnection');

// -------- PRODUCT CONTROLLERS --------
const listProducts = async (req, res) => {
	try {
		const { page = 1, pageSize = 10 } = req.body;
		const offset = (page - 1) * pageSize;
		const pool = getPool();
		const result = await pool.request()
			.input('pageSize', sql.Int, pageSize)
			.input('offset', sql.Int, offset)
			.query(`SELECT p.Price, p.ProductId, p.ProductName, c.CategoryId, c.Name AS CategoryName FROM Product p JOIN Category c ON p.CategoryId = c.CategoryId ORDER BY p.productId OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
		const totalResult = await pool.request().query('SELECT COUNT(*) as total FROM Product');
		const rows = result.recordset;
		const total = totalResult.recordset[0].total;
		res.status(200).json({ data: rows, total });
	} catch (error) {
		res.status(500).json({ message: "Error listing products", error });
	}
};

const getProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const pool = getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    p.ProductId, 
                    p.ProductName, 
                    c.CategoryId, 
                    c.Name AS CategoryName
                FROM Product p 
                JOIN Category c ON p.CategoryId = c.CategoryId
                WHERE p.ProductId = @id
            `);
        res.status(200).json(result.recordset[0] || {});
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};


const createProduct = async (req, res) => {
    try {
        const { productName, categoryId , description} = req.body;
        const pool = getPool();
        const result = await pool.request()
            .input('productName', sql.NVarChar, productName)
            .input('categoryId', sql.Int, categoryId)
            .input('description', sql.NVarChar, description)
            .query(`
                INSERT INTO Product (ProductName, CategoryId, description) 
                OUTPUT INSERTED.ProductId 
                VALUES (@productName, @categoryId, @description)
            `);
        res.status(200).json({ productId: result.recordset[0].ProductId, productName, categoryId });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id, productName, categoryId } = req.body;
        const pool = getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('productName', sql.NVarChar, productName)
            .input('categoryId', sql.Int, categoryId)
            .query(`
                UPDATE Product 
                SET ProductName=@productName, CategoryId=@categoryId 
                WHERE ProductId=@id
            `);
        res.status(200).json({ id, productName, categoryId });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const pool = getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Product WHERE ProductId=@id');
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};

module.exports = {
	listProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct
};