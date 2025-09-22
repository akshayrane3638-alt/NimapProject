const { getPool, sql } = require('../../DbConnection/mssqlConnection');

const listCategories = async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .query(`SELECT CategoryId, Name FROM Category`);
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

const getCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const pool = getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT CategoryId, Name FROM Category WHERE CategoryId=@id`);
        res.status(200).json(result.recordset[0] || {});
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error });
    }
};


const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const pool = getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .query(`
                INSERT INTO Category (Name) 
                OUTPUT INSERTED.CategoryId 
                VALUES (@name)
            `);
        res.status(200).json({ id: result.recordset[0].CategoryId, name });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
};


const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        const pool = getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .query(`UPDATE Category SET Name=@name WHERE CategoryId=@id`);
        res.status(200).json({ id, name });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
};


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const pool = getPool();

        // Check if category has products
        const productCheck = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT COUNT(*) as count FROM Product WHERE CategoryId=@id`);

        if (productCheck.recordset[0].count > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete category: products exist under this category." 
            });
        }

        // If no products → delete category
        await pool.request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM Category WHERE CategoryId=@id`);

        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    }
};


// const deleteCategory = async (req, res) => {
//     try {
//         const { id } = req.body;
//         const pool = getPool();
//         await pool.request()
//             .input('id', sql.Int, id)
//             .query(`DELETE FROM Category WHERE CategoryId=@id`);
//         res.status(200).json({ success: true });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting category", error });
//     }
// };


module.exports = {
    listCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}
