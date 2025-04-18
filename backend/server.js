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

    const { product_Group, product_Category, main_Product, sub_Product } =
      req.body;

    const result = await pool
      .request()
      .input("product_Group", sql.VarChar, product_Group)
      .input("product_Category", sql.VarChar, product_Category)
      .input("main_Product", sql.VarChar, main_Product)
      .input("sub_Product", sql.VarChar, sub_Product)
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
    const { product_Group, product_Category, main_Product, sub_Product, TextSearch } =
      req.body;

    const result = await pool
      .request()
      .input("product_Group", sql.VarChar, product_Group)
      .input("product_Category", sql.VarChar, product_Category)
      .input("main_Product", sql.VarChar, main_Product)
      .input("sub_Product", sql.VarChar, sub_Product)
      .input("TextSearch", sql.VarChar, TextSearch)
      .execute("SP_Search_Product");

    res.status(200).json(result.recordset);
    
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
