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

app.get(`/api/get/data`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM Product");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/get/dataReport`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { ID } = req.body;

    const result = await pool
      .request()
      .query(`SELECT * FROM Product WHERE Product.ID = ${ID}`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json("error");
    console.error(error);
  }
});

app.post(`/api/post/dataProduct`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { type } = req.body;
    const result = await pool
      .request()
      .query(`SELECT * FROM Product WHERE Product_type LIKE '%${type}%'`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json("error");
    console.error(error);
  }
});

app.post(`/api/post/log`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { hashtags } = req.body;

    const formattedHashtags = hashtags.join(", ");

    const result = await pool
      .request()
      .input("format", sql.VarChar, formattedHashtags)
      .query("INSERT INTO Search_log (Search_Log) VALUES (@format)");

    res.status(200).json({ message: "Get_Log" });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
