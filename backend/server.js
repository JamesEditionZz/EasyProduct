const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const fs = require("fs");
const path = require("path");

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

app.get("/api/image", (req, res) => {
  const baseDir = "/mnt/mount_file"; // ✅ เพิ่มบรรทัดนี้

  const filePathParam = req.query.path;

  if (!filePathParam) {
    return res.status(400).json({ error: "Missing path" });
  }

  const decodedPath = decodeURIComponent(filePathParam);
  const fullPath = path.join(baseDir, decodedPath);

  console.log("Trying to read:", fullPath);

  if (!fullPath.startsWith(baseDir)) {
    return res.status(400).json({ error: "Invalid path" });
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "File not found" });
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentTypeMap = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
  };

  const contentType = contentTypeMap[ext] || "application/octet-stream";
  const imageBuffer = fs.readFileSync(fullPath);

  res.setHeader("Content-Type", contentType);
  res.send(imageBuffer);
});

app.get("/api/pdf", (req, res) => {
  const baseDir = "/mnt/mount_file";
  const filePathParam = req.query.path;

  if (!filePathParam) {
    return res.status(400).json({ error: "Missing path" });
  }

  const decodedPath = decodeURIComponent(filePathParam);
  const fullPath = path.join(baseDir, decodedPath);

  if (!fullPath.startsWith(baseDir)) {
    return res.status(403).json({ error: "Invalid path" });
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "File not found" });
  }

  const fileStream = fs.createReadStream(fullPath);
  res.setHeader("Content-Type", "application/pdf");
  fileStream.pipe(res);
});

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

    const { Product_Serie, Product_type_name } =
      req.body;

    const result = await pool
      .request()
      .input("Product_Serie", sql.VarChar, Product_Serie)
      .input("Product_type_name", sql.VarChar, Product_type_name)
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

app.get(`/api/get/updatePrice`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const response = await fetch(`http://192.168.199.104:9083/jderest/v3/orchestrator/Easy_Product_Guide_API`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from("itskor:itskor").toString("base64"),
      },
      body: JSON.stringify({
        Effective_Date_1: "01/01/25",
        Expired_Date_1: "31/12/25",
      }),
    });

    const dataerp = await response.json();
    const arrayupdate = dataerp.ServiceRequest1.fs_DATABROWSE_V4106C.data.gridData.rowset;

    for (const item of arrayupdate) {
      const litm = item.F4106_LITM?.trim();
      const uprc = item.F4106_UPRC;

      if (litm && uprc) {
        try {
          await pool.request()
            .input("F4106_LITM", sql.VarChar, litm)
            .input("F4106_UPRC", sql.Int, uprc)
            .execute('SP_UpdatePrice');
        } catch (innerErr) {
          console.error(`Update failed for ${litm}:`, innerErr);
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
