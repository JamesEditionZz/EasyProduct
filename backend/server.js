const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const port = 5005;
const app = express();

app.use(cors());
app.use(express.json());

const config = {
  user: "sa",
  password: "P@55w0rd",
  server: "192.168.199.20",
  port: 1433,
  database: "dbEasyProductGuide",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.get(`/api/get/groupProduct`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("Product_group_list");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/post/categoryProduct`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { groupname } = req.body;

    const result = await pool
      .request()
      .input("name_type", sql.VarChar, groupname)
      .execute(`SP_Get_Category_Product`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json("error");
    console.error(error);
  }
});

app.post(`/api/post/MainProduct`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { product_Group, product_Category } = req.body;

    console.log(req.body);

    const result = await pool
      .request()
      .input("product_Group", sql.VarChar, product_Group)
      .input("product_Category", sql.VarChar, product_Category)
      .execute(`Data_MainProduct`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json("error");
    console.error(error);
  }
});

app.post(`/api/post/SubProduct`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { product_Group, product_Category, main_Product } = req.body;

    const result = await pool
      .request()
      .input("product_Group", sql.VarChar, product_Group)
      .input("product_Category", sql.VarChar, product_Category)
      .input("main_Product", sql.VarChar, main_Product)
      .execute(`Data_SubProduct`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json("error");
    console.error(error);
  }
});

app.post(`/api/post/Product`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { Product_Serie } =
      req.body;

    console.log(req.body);
    

    const result = await pool
      .request()
      .input("Product_Serie", sql.VarChar, Product_Serie)
      .execute(`SP_SelectProduct`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json("error");
    console.error(error);
  }
});

app.get(`/api/get/Product`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query(`SELECT * FROM Product`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json("error");
    console.error(error);
  }
});

app.post(`/api/post/Log`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { hashtags } = req.body;

    const formattedHashtags = hashtags.join(", ");

    const result = await pool
      .request()
      .input("format", sql.VarChar, formattedHashtags)
      .execute("SP_GetLog");

    res.status(200).json({ message: "Get_Log" });
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/post/searchText`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const {
      Product_type,
      Product_type_name,
      main_Product,
      sub_Product,
      TextSearch,
    } = req.body;

    if (Product_type && Product_type_name && main_Product && TextSearch) {
      const result = await pool
        .request()
        .input("Product_type", sql.VarChar, Product_type)
        .input("Product_type_name", sql.VarChar, Product_type_name)
        .input("main_Product", sql.VarChar, main_Product)
        .input("TextSearch", sql.VarChar, `%${TextSearch}%`)
        .query(`SELECT * FROM Product WHERE Product_type = @Product_type AND 
          Product_type_name = @Product_type_name AND 
          Main_Product = main_Product AND 
            Product_Serie LIKE @TextSearch OR
            Product_FG LIKE @TextSearch OR
            Product_price LIKE @TextSearch OR
            Description LIKE @TextSearch OR
            Product_type LIKE @TextSearch OR
            Product_type_name LIKE @TextSearch`);

      res.status(200).json(result.recordset);
    } else if (Product_type && Product_type_name && TextSearch) {
      const result = await pool
        .request()
        .input("Product_type", sql.VarChar, Product_type)
        .input("Product_type_name", sql.VarChar, Product_type_name)
        .input("TextSearch", sql.VarChar, `%${TextSearch}%`)
        .query(`SELECT DISTINCT Product_Serie FROM Product WHERE Product_type = @Product_type AND 
          Product_type_name = @Product_type_name AND 
            Product_Serie LIKE @TextSearch`);

      res.status(200).json(result.recordset);
    } else if (Product_type && TextSearch) {
      const result = await pool
        .request()
        .input("Product_type", sql.VarChar, Product_type)
        .input("TextSearch", sql.VarChar, `%${TextSearch}%`)
        .query(`SELECT DISTINCT Product_type_name FROM Product 
          WHERE Product_type = @Product_type AND 
          Product_type_name LIKE @TextSearch `);

      res.status(200).json(result.recordset);
    } else {
      const result = await pool
        .request()
        .input("TextSearch", sql.VarChar, TextSearch)
        .execute("SP_Search_Product");

      res.status(200).json(result.recordset);
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
