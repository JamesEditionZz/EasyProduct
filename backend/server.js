const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const ActiveDirectory = require("activedirectory2");

const app = express();
const port = 5003;

app.use(cors());
app.use(bodyParser.json());

const config = {
  user: "sa",
  password: "P@55w0rd",
  server: "192.168.199.20",
  port: 1433,
  database: "dbXsfq",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.post(`/Login/member`, async (req, res) => {
  try {
    const { username, password } = req.body;

    const configAD = {
      url: "ldap://10.15.0.10", // เปลี่ยนเป็น URL ของ AD Server
      baseDN: "dc=PTK,dc=LOCAL", // ระบุ Base DN ขององค์กร
      usernameAD: `PTK\\${username}`, // บัญชีที่ใช้ bind
      passwordAD: `${password}`, // รหัสผ่าน
    };

    const AD = new ActiveDirectory(configAD);

    // ฟังก์ชันตรวจสอบผู้ใช้
    function authenticateUser(username, password) {
      // ✅ ใช้ username ที่รับมา แทนการใช้ใน configAD
      const domainUsername = `PTK\\${username}`; // ✅ แปลงเป็น DOMAIN\username

      AD.authenticate(domainUsername, password, async (err, auth) => {
        if (err) {
          return res
            .status(401)
            .json({ success: false, message: "Authentication failed" });
        }
        if (auth) {
          const pool = await sql.connect(config);
          const datenow = new Date();
          const checklogin = await pool
            .request()
            .input("userinfo", sql.VarChar, username)
            .query("SELECT * FROM Loginlog WHERE Username = @userinfo");
          if (checklogin.recordset.length > 0) {
            res.status(200).json("success");
          } else {
            const getinfo = await pool
              .request()
              .input("userinfo", sql.VarChar, username)
              .input("Datetime", sql.DateTime, datenow.toLocaleString())
              .query(
                "INSERT INTO Loginlog (Username, Datetime) VALUES(@userinfo, @Datetime)"
              );
            res.status(200).json("success");
          }
        } else {
          return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
        }
      });
    }

    // ทดสอบการล็อกอิน
    authenticateUser(username, password);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/get", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .query(
        "SELECT DISTINCT ID, Product_type,Product_name, Product_img, Product_img_name FROM Product_group ORDER BY ID ASC"
      );

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  } finally {
    await sql.close();
  }
});

app.get(`/api/equipment_list`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { id } = req.query;

    if (id) {
      storedProductType = id;
    }

    const result = await pool
      .request()
      .input("ProductType", sql.VarChar, storedProductType)
      .execute("dbProduct_list");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get(`/api/find_Accessories`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().execute("dbAccessories_list");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post(`/api/model`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const model = req.body;

    const result = await pool
      .request()
      .input("value", sql.VarChar, model.Product_model)
      .input("type", sql.VarChar, model.type)
      .execute("dbGET_model");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching model:", error); // Log ข้อผิดพลาด
    res.status(500).send("Internal Server Error");
  }
});

app.post(`/api/Accessories_model`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { Accessories_type } = req.body;

    const result = await pool
      .request()
      .input("Accessories_type", sql.VarChar, Accessories_type)
      .query("SELECT * FROM Accessories WHERE Access_type = @Accessories_type");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching model:", error); // Log ข้อผิดพลาด
    res.status(500).send("Internal Server Error");
  }
});

app.post(`/api/size`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const model = req.body;

    const result = await pool

      .request()
      .input("value", sql.VarChar, model.productName)
      .execute("dbfind_size_model");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/checksize`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { width, height, depth, product_model, product_type } = req.body;

    const widthValue = width ? width : null;
    const heightValue = height ? height : null;
    const depthValue = depth ? depth : null;
    const modelValue = product_model ? product_model : null;

    const result = await pool

      .request()
      .input("width", sql.VarChar, widthValue)
      .input("height", sql.VarChar, heightValue)
      .input("depth", sql.VarChar, depthValue)
      .input("modelValue", sql.VarChar, modelValue)
      .input("Product_type", sql.VarChar, product_type)
      .execute("dbfind_model");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/checkprice`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { lowPrice, highPrice, product_model, product_type } = req.body;

    const lowPriceValue = lowPrice ? lowPrice : null;
    const highPriceValue = highPrice ? highPrice : null;
    const modelValue = product_model ? product_model : null;

    const result = await pool

      .request()
      .input("lowPrice", sql.VarChar, lowPriceValue)
      .input("highPrice", sql.VarChar, highPriceValue)
      .input("modelValue", sql.VarChar, modelValue)
      .input("Product_type", sql.VarChar, product_type)
      .execute("dbfind_Price_model");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/selectItem`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { type, product_model, product_type } = req.body;

    const result = await pool

      .request()
      .input("Product_category", sql.VarChar, type)
      .input("Product_name", sql.VarChar, product_model)
      .input("Product_type", sql.VarChar, product_type)
      .execute("dbfind_type");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/Accessories`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const selectedProduct = req.body.selectedProduct;

    const result = await pool

      .request()
      .input("Product_name", sql.VarChar, selectedProduct.Product_name)
      .input("Product_model", sql.VarChar, selectedProduct.Product_model)
      .input("category", sql.VarChar, selectedProduct.category)
      .input("type", sql.VarChar, selectedProduct.type)
      .input("depth", sql.Int, selectedProduct.depth)
      .input("width", sql.Int, selectedProduct.width)
      .input("height", sql.Int, selectedProduct.height)

      .execute("dbSelect_Accesseries");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/FrontScreen`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { findscreen } = req.body;

    const result = await pool
      .request()
      .input("Access_width", sql.Int, findscreen)
      .execute("db_Accessories_FrontScreen");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/SideScreen`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { findscreen } = req.body;

    const result = await pool
      .request()
      .input("Access_width", sql.Int, findscreen)
      .execute("db_Accessories_SideScreen");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/api/Flip`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("db_Accesseries_Flip");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/api/Electric`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("db_Accesseries_Electric");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/api/Snake`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("db_Accesseries_Snake");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/ProductReport`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { Product, color } = req.body;

    const productData = Product;

    const result = await pool

      .request()
      .input("Product_name", sql.VarChar, productData.Product_name)
      .input("Product_model", sql.VarChar, productData.Product_model)
      .input("category", sql.VarChar, productData.category)
      .input("type", sql.VarChar, productData.type)
      .input("depth", sql.Int, productData.depth)
      .input("width", sql.Int, productData.width)
      .input("height", sql.Int, productData.height)
      .input("color", sql.VarChar, color)
      .execute("db_TableReport");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/Chairproductreport`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { Product } = req.body;

    const result = await pool

      .request()
      .input("Product_name", sql.VarChar, Product.Product_name)
      .input("Product_model", sql.VarChar, Product.Product_model)
      .input("type", sql.VarChar, Product.type)
      .input("depth", sql.Int, Product.depth)
      .input("width", sql.Int, Product.width)
      .input("height", sql.Int, Product.height)
      .execute("db_ChairReport");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/Accessories_Data`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { Accessories } = req.body;

    const result = await pool
      .request()
      .input("Accessories_name", sql.VarChar, Accessories.Access_name)
      .execute("db_find_Report_Accessories");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/Report/modesty`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { Product, modesty } = req.body;

    const Product_model = Product;

    const Check_S = Product_model.Product_model.slice(-1);
    const model = Product_model.Product_model.split("-");
    const code = model[2].slice(0, 2);
    const codenumber = model[2].slice(2);
    let Product_width = "";
    let Accessories_width = "";

    if (code === "DD") {
      Product_width = Product_model.width / (codenumber / 2);
    } else {
      Product_width = Product_model.width / codenumber;
    }

    if (Check_S == "S") {
      Accessories_width = Product_width - 550;
    } else {
      Accessories_width = Product_width - 200;
    }

    const result = await pool
      .request()
      .input("modesty", sql.VarChar, modesty)
      .input("width", sql.Int, Accessories_width)
      .execute("dbfind_Modesty");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/FrontScreen`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const frontscreen = req.body;

    const result = await pool
      .request()
      .input("screen", sql.VarChar, frontscreen.frontscreen)
      .query("SELECT * FROM Accessories WHERE Access_name = @screen");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/SideScreen`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const sidescreen = req.body;

    const result = await pool
      .request()
      .input("screen", sql.VarChar, sidescreen.sidescreen)
      .query("SELECT * FROM Accessories WHERE Access_name = @screen");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/Flip`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const flip = req.body;

    const result = await pool
      .request()
      .input("flip", sql.VarChar, flip.flip)
      .query("SELECT * FROM Accessories WHERE Access_name = @flip");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/Wireway`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const wireway = req.body;

    const result = await pool
      .request()
      .input("wireway", sql.VarChar, wireway.Snake)
      .query("SELECT * FROM Accessories WHERE Access_name = @wireway");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/Electric`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const Electric = req.body;

    const result = await pool
      .request()
      .input("Electric", sql.VarChar, Electric.Electric)
      .query("SELECT * FROM Accessories WHERE Access_name = @Electric");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/Numrail`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("Numrail", sql.VarChar, "รางประคอง")
      .query("SELECT * FROM Accessories WHERE Access_name = @Numrail");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/searchProductmodel`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { e, product_type, product_Name } = req.body;

    const result = await pool
      .request()
      .input("Product_name", sql.VarChar, product_Name)
      .input("Product_modal", sql.VarChar, e)
      .input("product_type", sql.VarChar, product_type)
      .execute("dbsearchProduct_Modal");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/MasterData`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const parsedData = req.body.selectedProduct;

    const {
      Product_name,
      Product_model,
      category,
      type,
      img,
      depth,
      width,
      height,
    } = parsedData;

    const {
      nameProject,
      Acccolor,
      Accmodesty,
      numModesty,
      frontScreen,
      numFrontScreen,
      sideScreen,
      numSideScreen,
      Accflip,
      numFilp,
      Accflipposition,
      AccElectric,
      numElectric,
      AccElectricposition,
      AccSnake,
      numVertical,
      numRail,
      username,
    } = req.body;

    const result_find_product = await pool
      .request()
      .input("Product_name", sql.VarChar, Product_name)
      .input("Product_model", sql.VarChar, Product_model)
      .input("category", sql.VarChar, category)
      .input("type", sql.VarChar, type)
      .input("img", sql.VarChar, img)
      .input("depth", sql.Int, depth)
      .input("width", sql.Int, width)
      .input("height", sql.Int, height)
      .input("Product_color", sql.VarChar, Acccolor)
      .execute(`db_find_Product`);

    const DataProduct = result_find_product.recordset;

    const MasterDataResult = await pool
      .request()
      .input("Product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
      .input("Product_name", sql.VarChar, DataProduct?.[0]?.Product_name)
      .input("Product_model", sql.VarChar, DataProduct?.[0]?.Product_model)
      .input("type", sql.VarChar, type)
      .input("img", sql.VarChar, img)
      .input("depth", sql.Int, parseInt(depth))
      .input("width", sql.Int, parseInt(width))
      .input("height", sql.Int, parseInt(height))
      .input("Product_price", sql.Int, DataProduct?.[0]?.Product_price)
      .input(
        "Product_Cfeature",
        sql.VarChar,
        DataProduct?.[0]?.Product_Cfeature
      )
      .input(
        "Product_Cfunction",
        sql.VarChar,
        DataProduct?.[0]?.Product_Cfunction
      )
      .input("Product_Ctype", sql.VarChar, DataProduct?.[0]?.Product_Ctype)
      .input("Color_name", sql.VarChar, Acccolor)
      .input("Access_name_1", sql.VarChar, Accmodesty || "")
      .input("Access_number_1", sql.Int, parseInt(numModesty || ""))
      .input("Access_name_2", sql.VarChar, frontScreen || "")
      .input("Access_number_2", sql.Int, parseInt(numFrontScreen || ""))
      .input("Access_name_3", sql.VarChar, sideScreen || "")
      .input("Access_number_3", sql.Int, parseInt(numSideScreen || ""))
      .input("Access_name_4", sql.VarChar, Accflip || "")
      .input("Access_number_4", sql.Int, parseInt(numFilp || ""))
      .input("Access_position_4", sql.VarChar, Accflipposition || "")
      .input("Access_name_5", sql.VarChar, AccElectric || "")
      .input("Access_number_5", sql.Int, parseInt(numElectric || ""))
      .input("Access_position_5", sql.VarChar, AccElectricposition || "")
      .input("Access_name_6", sql.VarChar, AccSnake || "")
      .input("Access_number_6", sql.Int, parseInt(numVertical || ""))
      .input("Access_name_7", sql.VarChar, null || "")
      .input("Access_number_7", sql.Int, parseInt(numRail || ""))
      .execute(`db_find_DataMaster`);

    const MasterData = MasterDataResult.recordset;

    let Accessories_number = 0;

    if (Accmodesty) {
      Accessories_number += 1;
    }
    if (frontScreen) {
      Accessories_number += 1;
    }
    if (sideScreen) {
      Accessories_number += 1;
    }
    if (Accflip) {
      Accessories_number += 1;
    }
    if (AccElectric) {
      Accessories_number += 1;
    }
    if (AccSnake) {
      Accessories_number += 1;
    }
    if (numRail) {
      Accessories_number += 1;
    }

    const NewFG = DataProduct?.[0]?.Product_fg + "-" + Accessories_number;

    if (MasterData.length == 0) {
      try {
        const result = await pool
          .request()
          .input("Product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
          .input("Product_name", sql.VarChar, DataProduct?.[0]?.Product_name)
          .input("Product_model", sql.VarChar, DataProduct?.[0]?.Product_model)
          .input("type", sql.VarChar, type)
          .input("img", sql.VarChar, img)
          .input("depth", sql.Int, parseInt(depth))
          .input("width", sql.Int, parseInt(width))
          .input("height", sql.Int, parseInt(height))
          .input("Product_price", sql.Int, DataProduct?.[0]?.Product_price)
          .input(
            "Product_Cfeature",
            sql.VarChar,
            DataProduct?.[0]?.Product_Cfeature
          )
          .input(
            "Product_Cfunction",
            sql.VarChar,
            DataProduct?.[0]?.Product_Cfunction
          )
          .input("Product_Ctype", sql.VarChar, DataProduct?.[0]?.Product_Ctype)
          .input("Color_name", sql.VarChar, Acccolor)
          .input("Access_name_1", sql.VarChar, Accmodesty || null)
          .input("Access_number_1", sql.Int, parseInt(numModesty || null))
          .input("Access_name_2", sql.VarChar, frontScreen || null)
          .input("Access_number_2", sql.Int, parseInt(numFrontScreen || null))
          .input("Access_name_3", sql.VarChar, sideScreen || null)
          .input("Access_number_3", sql.Int, parseInt(numSideScreen || null))
          .input("Access_name_4", sql.VarChar, Accflip || null)
          .input("Access_position_4", sql.VarChar, Accflipposition || null)
          .input("Access_number_4", sql.Int, parseInt(numFilp || null))
          .input("Access_name_5", sql.VarChar, AccElectric || null)
          .input("Access_position_5", sql.VarChar, AccElectricposition || null)
          .input("Access_number_5", sql.Int, parseInt(numElectric || null))
          .input("Access_name_6", sql.VarChar, AccSnake || null)
          .input("Access_number_6", sql.Int, parseInt(numVertical || null))
          .input("Access_name_7", sql.VarChar, null || null)
          .input("Access_number_7", sql.Int, parseInt(numRail || null))
          .input("New_product_fg", sql.VarChar, NewFG || null)
          .execute("db_ProductMaster");

        if (result) {
          const CheckInsertProject = await pool
            .request()
            .input("Product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
            .input("Product_name", sql.VarChar, DataProduct?.[0]?.Product_name)
            .input(
              "Product_model",
              sql.VarChar,
              DataProduct?.[0]?.Product_model
            )
            .input("type", sql.VarChar, type)
            .input("img", sql.VarChar, img)
            .input("depth", sql.Int, parseInt(depth))
            .input("width", sql.Int, parseInt(width))
            .input("height", sql.Int, parseInt(height))
            .input("Product_price", sql.Int, DataProduct?.[0]?.Product_price)
            .input(
              "Product_Cfeature",
              sql.VarChar,
              DataProduct?.[0]?.Product_Cfeature
            )
            .input(
              "Product_Cfunction",
              sql.VarChar,
              DataProduct?.[0]?.Product_Cfunction
            )
            .input(
              "Product_Ctype",
              sql.VarChar,
              DataProduct?.[0]?.Product_Ctype
            )
            .input("Color_name", sql.VarChar, Acccolor)
            .input("Access_name_1", sql.VarChar, Accmodesty || "")
            .input("Access_number_1", sql.Int, parseInt(numModesty || ""))
            .input("Access_name_2", sql.VarChar, frontScreen || "")
            .input("Access_number_2", sql.Int, parseInt(numFrontScreen || ""))
            .input("Access_name_3", sql.VarChar, sideScreen || "")
            .input("Access_number_3", sql.Int, parseInt(numSideScreen || ""))
            .input("Access_name_4", sql.VarChar, Accflip || "")
            .input("Access_number_4", sql.Int, parseInt(numFilp || ""))
            .input("Access_position_4", sql.VarChar, Accflipposition || "")
            .input("Access_name_5", sql.VarChar, AccElectric || "")
            .input("Access_number_5", sql.Int, parseInt(numElectric || ""))
            .input("Access_position_5", sql.VarChar, AccElectricposition || "")
            .input("Access_name_6", sql.VarChar, AccSnake || "")
            .input("Access_number_6", sql.Int, parseInt(numVertical || ""))
            .input("Access_name_7", sql.VarChar, null || "")
            .input("Access_number_7", sql.Int, parseInt(numRail || ""))
            .execute(`db_find_DataMaster`);

          const InsertProject = CheckInsertProject.recordset;

          if (InsertProject) {
            const resultProject = await pool
              .request()
              .input("Product_ID", sql.Int, InsertProject?.[0]?.ID)
              .input("Project_name", sql.VarChar, nameProject)
              .input("Project_username", sql.VarChar, username)
              .execute(`Insert_Project`);

            return res.status(200).json({
              success: true,
              message: "Master data and project inserted.",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Master data and project inserted.",
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const CheckInsertProject = await pool
        .request()
        .input("Product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
        .input("Product_name", sql.VarChar, DataProduct?.[0]?.Product_name)
        .input("Product_model", sql.VarChar, DataProduct?.[0]?.Product_model)
        .input("type", sql.VarChar, type)
        .input("img", sql.VarChar, img)
        .input("depth", sql.Int, parseInt(depth))
        .input("width", sql.Int, parseInt(width))
        .input("height", sql.Int, parseInt(height))
        .input("Product_price", sql.Int, DataProduct?.[0]?.Product_price)
        .input(
          "Product_Cfeature",
          sql.VarChar,
          DataProduct?.[0]?.Product_Cfeature
        )
        .input(
          "Product_Cfunction",
          sql.VarChar,
          DataProduct?.[0]?.Product_Cfunction
        )
        .input("Product_Ctype", sql.VarChar, DataProduct?.[0]?.Product_Ctype)
        .input("Color_name", sql.VarChar, Acccolor)
        .input("Access_name_1", sql.VarChar, Accmodesty || "")
        .input("Access_number_1", sql.Int, parseInt(numModesty || ""))
        .input("Access_name_2", sql.VarChar, frontScreen || "")
        .input("Access_number_2", sql.Int, parseInt(numFrontScreen || ""))
        .input("Access_name_3", sql.VarChar, sideScreen || "")
        .input("Access_number_3", sql.Int, parseInt(numSideScreen || ""))
        .input("Access_name_4", sql.VarChar, Accflip || "")
        .input("Access_number_4", sql.Int, parseInt(numFilp || ""))
        .input("Access_position_4", sql.VarChar, Accflipposition || "")
        .input("Access_name_5", sql.VarChar, AccElectric || "")
        .input("Access_number_5", sql.Int, parseInt(numElectric || ""))
        .input("Access_position_5", sql.VarChar, AccElectricposition || "")
        .input("Access_name_6", sql.VarChar, AccSnake || "")
        .input("Access_number_6", sql.Int, parseInt(numVertical || ""))
        .input("Access_name_7", sql.VarChar, null || "")
        .input("Access_number_7", sql.Int, parseInt(numRail || ""))
        .execute(`db_find_DataMaster`);

      const InsertProject = CheckInsertProject.recordset;

      const CheckProject = await pool
        .request()
        .input("Product_ID", sql.Int, InsertProject?.[0]?.ID)
        .input("Project_name", sql.VarChar, nameProject)
        .input("Project_username", sql.VarChar, username)
        .query(
          `SELECT * FROM ProjectDetail WHERE Product_ID = @Product_ID AND Project_name = @Project_name AND Project_username = @Project_username`
        );
      const Project_Insert = CheckProject.recordset;

      if (Project_Insert.length == 0) {
        const result = await pool
          .request()
          .input("Product_ID", sql.Int, InsertProject?.[0]?.ID)
          .input("Project_name", sql.VarChar, nameProject)
          .input("Project_username", sql.VarChar, username)
          .execute(`Insert_Project`);

        return res.status(200).json({
          success: true,
          message: "Master data and project inserted.",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Master data and project inserted.",
        });
      }
    }

    res.status(200).json({
      message: "Master data processed successfully",
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.post(`/api/MasterDataChair`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const {
      selectedProduct: {
        Product_name,
        Product_model,
        type,
        img,
        depth,
        width,
        height,
      },
      nameProject,
      username,
    } = req.body;

    console.log(req.body);

    const find_dataProduct = await pool
      .request()
      .input("Product_name", sql.VarChar, Product_name)
      .input("Product_model", sql.VarChar, Product_model)
      .input("type", sql.VarChar, type)
      .input("img", sql.VarChar, img)
      .input("depth", sql.Int, parseInt(depth))
      .input("width", sql.Int, parseInt(width))
      .input("height", sql.Int, parseInt(height))
      .execute(`db_findChair_Product`);

    const DataProduct = find_dataProduct.recordset;

    const MasterDataResult = await pool
      .request()
      .input("Product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
      .input("Product_name", sql.VarChar, DataProduct?.[0]?.Product_name)
      .input("Product_model", sql.VarChar, DataProduct?.[0]?.Product_model)
      .input("type", sql.VarChar, DataProduct?.[0]?.Product_type)
      .input("img", sql.VarChar, DataProduct?.[0]?.Product_img)
      .input("depth", sql.Int, parseInt(DataProduct?.[0]?.Product_depth))
      .input("width", sql.Int, parseInt(DataProduct?.[0]?.Product_width))
      .input("height", sql.Int, parseInt(DataProduct?.[0]?.Product_height))
      .input("Product_price", sql.Int, DataProduct?.[0]?.Product_price)
      .execute(`db_findChair_DataMaster`);

    const MasterData = MasterDataResult.recordset;

    if (MasterData.length == 0) {
      try {
        const result = await pool
          .request()
          .input("Product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
          .input("Product_name", sql.VarChar, DataProduct?.[0]?.Product_name)
          .input("Product_model", sql.VarChar, DataProduct?.[0]?.Product_model)
          .input("type", sql.VarChar, DataProduct?.[0]?.Product_type)
          .input("img", sql.VarChar, DataProduct?.[0]?.Product_img)
          .input("depth", sql.Int, parseInt(DataProduct?.[0]?.Product_depth))
          .input("width", sql.Int, parseInt(DataProduct?.[0]?.Product_width))
          .input("height", sql.Int, parseInt(DataProduct?.[0]?.Product_height))
          .input(
            "Product_price",
            sql.Int,
            DataProduct?.[0]?.Product_price || null
          )
          .input(
            "Product_Cfeature",
            sql.VarChar,
            DataProduct?.[0]?.Product_Cfeature || null
          )
          .input(
            "Product_Cfunction",
            sql.VarChar,
            DataProduct?.[0]?.Product_Cfunction || null
          )
          .input(
            "Product_Ctype",
            sql.VarChar,
            DataProduct?.[0]?.Product_Ctype || null
          )
          .input("Color_name", sql.VarChar, DataProduct?.[0]?.Product_Color)
          .input("Access_name_1", sql.VarChar, null)
          .input("Access_number_1", sql.Int, parseInt(null))
          .input("Access_name_2", sql.VarChar, null)
          .input("Access_number_2", sql.Int, parseInt(null))
          .input("Access_name_3", sql.VarChar, null)
          .input("Access_number_3", sql.Int, parseInt(null))
          .input("Access_name_4", sql.VarChar, null)
          .input("Access_position_4", sql.VarChar, null)
          .input("Access_number_4", sql.Int, parseInt(null))
          .input("Access_name_5", sql.VarChar, null)
          .input("Access_position_5", sql.VarChar, null)
          .input("Access_number_5", sql.Int, parseInt(null))
          .input("Access_name_6", sql.VarChar, null)
          .input("Access_number_6", sql.Int, parseInt(null))
          .input("Access_name_7", sql.VarChar, null)
          .input("Access_number_7", sql.Int, parseInt(null))
          .input("New_product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
          .execute("db_ProductMaster");

        if (result) {
          const CheckInsertProject = await pool
            .request()
            .input("Product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
            .input("Product_name", sql.VarChar, DataProduct?.[0]?.Product_name)
            .input(
              "Product_model",
              sql.VarChar,
              DataProduct?.[0]?.Product_model
            )
            .input("type", sql.VarChar, DataProduct?.[0]?.Product_type)
            .input("img", sql.VarChar, DataProduct?.[0]?.Product_img)
            .input("depth", sql.Int, parseInt(DataProduct?.[0]?.Product_depth))
            .input("width", sql.Int, parseInt(DataProduct?.[0]?.Product_width))
            .input(
              "height",
              sql.Int,
              parseInt(DataProduct?.[0]?.Product_height)
            )
            .input("Product_price", sql.Int, DataProduct?.[0]?.Product_price)
            .execute(`db_findChair_DataMaster`);

          const InsertProject = CheckInsertProject.recordset;

          if (InsertProject.length > 0) {
            const result = await pool
              .request()
              .input("Product_ID", sql.Int, InsertProject?.[0]?.ID)
              .input("Project_name", sql.VarChar, nameProject)
              .input("Project_username", sql.VarChar, username)
              .execute(`Insert_Project`);

            res.status(200).json(true);
          } else {
            res.status(200).json(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const CheckInsertProject = await pool
        .request()
        .input("Product_fg", sql.VarChar, DataProduct?.[0]?.Product_fg)
        .input("Product_name", sql.VarChar, DataProduct?.[0]?.Product_name)
        .input("Product_model", sql.VarChar, DataProduct?.[0]?.Product_model)
        .input("type", sql.VarChar, DataProduct?.[0]?.Product_type)
        .input("img", sql.VarChar, DataProduct?.[0]?.Product_img)
        .input("depth", sql.Int, parseInt(DataProduct?.[0]?.Product_depth))
        .input("width", sql.Int, parseInt(DataProduct?.[0]?.Product_width))
        .input("height", sql.Int, parseInt(DataProduct?.[0]?.Product_height))
        .input("Product_price", sql.Int, DataProduct?.[0]?.Product_price)
        .execute(`db_findChair_DataMaster`);

      const InsertProject = CheckInsertProject.recordset;

      const CheckProject = await pool
        .request()
        .input("Product_ID", sql.Int, InsertProject?.[0]?.ID)
        .input("Project_name", sql.VarChar, nameProject)
        .query(
          `SELECT * FROM ProjectDetail WHERE Product_ID = @Product_ID AND Project_name = @Project_name`
        );

      const Project_Insert = CheckProject.recordset;

      if (Project_Insert.length == 0) {
        const result = await pool
          .request()
          .input("Product_ID", sql.Int, InsertProject?.[0]?.ID)
          .input("Project_name", sql.VarChar, nameProject)
          .input("Project_username", sql.VarChar, username)
          .execute(`Insert_Project`);

        res.status(200).json(true);
      } else {
        res.status(200).json(true);
      }
    }
  } catch (error) {
    console.error("Error processing request:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

////// backendDashboard ///////

app.post(`/backenddashboard/check/member`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { username, password } = req.body;

    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .execute("db_slogin");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/backenddashboard/list_product`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().execute("db_product");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post("/backenddashboard/searchItem", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { model } = req.body;

    const result = await pool
      .request()
      .input("model", sql.VarChar, model)
      .execute("db_searchItem");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/backenddashboard/list_accessories`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().execute("db_Accessories");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/backenddashboard/searchaccessories`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { access } = req.body;

    const result = await pool
      .request()
      .input("access", sql.VarChar, `%${access}%`)
      .query(
        `SELECT DISTINCT Access_type FROM Accessories WHERE Access_type LIKE @access`
      );

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/backenddashboard/Delete_Item`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { ID } = req.body;

    const result = await pool
      .request()
      .input("Access_ID", sql.Int, ID)
      .execute(`Delete_Accessories`);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/backenddashboard/list_group`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query("SELECT * FROM Product_group");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/post/product`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const product_Color = req.body.product_Color;

    const {
      product_Type,
      product_name,
      product_Model,
      product_Category,
      product_FG,
      product_Width,
      product_Depth,
      product_Height,
      product_Price,
      product_Ctype,
      product_Cfunction,
      product_Cfeature,
      pathFile,
      Image,
    } = req.body;

    const path = pathFile.replace(/\\\\/g, "\\");

    for (let index = 0; index < product_Color.length; index++) {
      const result = await pool
        .request()
        .input("product_Type", sql.VarChar, product_Type)
        .input("product_name", sql.VarChar, product_name)
        .input("product_Model", sql.VarChar, product_Model)
        .input("product_Category", sql.VarChar, product_Category)
        .input("product_FG", sql.VarChar, product_FG)
        .input("product_Width", sql.Int, product_Width)
        .input("product_Depth", sql.Int, product_Depth)
        .input("product_Height", sql.Int, product_Height)
        .input("product_Price", sql.Int, product_Price)
        .input("product_Ctype", sql.VarChar, product_Ctype)
        .input("product_Cfunction", sql.VarChar, product_Cfunction)
        .input("product_Cfeature", sql.VarChar, product_Cfeature)
        .input("pathFile", sql.VarChar, path)
        .input("Image", sql.VarChar, Image)
        .input("product_Color", sql.VarChar, product_Color[index])
        .execute(`Insert_Product`);
    }

    res.status(200).json("true");
  } catch (error) {
    console.error(error);
  }
});

app.post(`/backenddashboard/Insert_Accessories`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const {
      fg,
      selectAccessories,
      modal,
      width,
      depth,
      height,
      price,
      path_File,
      image,
    } = req.body;

    const path = path_File.replace(/\\\\/g, "\\");
    const name_image = image.split(".").slice(0, -1).join(".");

    const result = await pool
      .request()
      .input("Access_name", sql.VarChar, modal)
      .input("Access_type", sql.VarChar, selectAccessories)
      .input("Access_price", sql.VarChar, price)
      .input("Access_width", sql.VarChar, width)
      .input("Access_depth", sql.VarChar, depth)
      .input("Access_height", sql.VarChar, height)
      .input("Access_img", sql.VarChar, path)
      .input("Access_FG", sql.VarChar, fg)
      .input("Access_img_name", sql.VarChar, name_image)
      .execute(`Insert_Accessories`);

    res.status(200).json(true);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
