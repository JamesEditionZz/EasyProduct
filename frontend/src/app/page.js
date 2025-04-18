"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page.css";
import Product_Group from "./Product_Group/page";
import Category from "./Category/page";
import MainProduct from "./MainItem/page";
import SubProduct from "./SubItem/page";
import Product from "./Product/page";
import Image from "next/image";

export default function Home() {
  const [hashtags, setHashTags] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [product_Group, setProduct_Group] = useState("");
  const [product_Category, setProduct_Category] = useState("");
  const [main_Product, setMain_Product] = useState("");
  const [sub_Product, setSub_Product] = useState("");
  const [selectProductPDF, setSelectProductPDF] = useState("");
  const [modelPDF, setModelPDF] = useState(0);

  const SearchEngine = async (value) => {
    const searchtext = await fetch(
      `http://localhost:5005/api/post/searchText`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_Group,
          product_Category,
          main_Product,
          sub_Product,
          TextSearch: value,
        }),
      }
    );

    const response = await searchtext.json()

    setDataSearch(response)

    // const filteredData = dataProduct.filter((item) =>
    //   Object.values(item).some((field) =>
    //     String(field).toLowerCase().includes(value.toLowerCase())
    //   )
    // );

    // setDataSearch(filteredData); // อัปเดต state ที่นี่
  };

  const Callbackvalue = (value) => {
    setHashTags([...hashtags, value]);
    setProduct_Group(value);
  };

  const CallbackCategory = (value) => {
    setHashTags([...hashtags, value]);
    setProduct_Category(value);
  };

  const CallbackMainItem = (value) => {
    setHashTags([...hashtags, value]);
    setMain_Product(value);
  };

  const CallbackSubItem = (value) => {
    setHashTags([...hashtags, value]);
    setSub_Product(value);
  };

  const backProduct = () => {
    if (hashtags.length == 1) {
      setProduct_Group("");
    }
    if (hashtags.length == 2) {
      setProduct_Category("");
    }
    if (hashtags.length == 3) {
      setMain_Product("");
    }
    if (hashtags.length == 4) {
      setSub_Product("");
    }
    if (dataSearch > 1) {
      setTextSearch("");
    }

    const updatedHashtags = [...hashtags]; // clone the array
    updatedHashtags.pop(); // remove last element
    setHashTags(updatedHashtags); // update with the new array
  };

  const closeModelPDF = (value) => {
    setModelPDF(value);
  };

  return (
    <>
      {modelPDF == 1 && (
        <div className="model-subitem" onClick={() => closeModelPDF(0)}>
          <div
            className="model-subitem-content animation-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="row mx-3 mt-4">
              <div className="col-6 border-1 animation-opacity">
                <iframe
                  src="/example.pdf"
                  width="100%"
                  height="800px"
                  style={{ border: "none" }}
                  alt="pdf"
                ></iframe>
              </div>
              <div className="col-6 border-1 animation-opacity">
                <table className="table">
                  <thead className="table-primary">
                    <tr className="text-center">
                      <th>FG</th>
                      <th>Reg No.</th>
                      <th>Size</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody className="table-secondary text-center">
                    <tr>
                      <td>FG000001</td>
                      <td>EXC-04/ML1</td>
                      <td>750 X 1500</td>
                      <td>10000</td>
                    </tr>
                    <tr>
                      <td>FG000002</td>
                      <td>EXC-04/ML2</td>
                      <td>750 X 1500</td>
                      <td>15000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h3 text-center mt-3">Easy Product Guide</div>
      <div className="row w-100 d-flex justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="row">
            <div className="col-11">
              <input
                className="form-control"
                placeholder="Search"
                // value={valueSearch}
                onChange={(e) => SearchEngine(e.target.value)}
              />
            </div>
            <div className="col-1">
              <button className="btn btn-primary">
                <Image
                  src={`/Icon/search.png`}
                  width={20}
                  height={20}
                  alt="search"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {product_Group && (
        <div className="mx-3">
          <div
            className="cursor-pointer position-absolute line-show-select-menu"
            onClick={() => backProduct()}
          >
            <Image
              src={`/Icon/left-arrow.png`}
              width={40}
              height={40}
              alt="left-arrow"
            />
            <span className="h5 mx-1">Back</span>
          </div>
        </div>
      )}
      {textSearch.length == 0 ? (
        <>
          {!product_Group ? (
            <div>
              <Product_Group onSelected={(value) => Callbackvalue(value)} />
            </div>
          ) : product_Group && !product_Category ? (
            <div>
              <Category
                product_Group={product_Group}
                onSelectCategory={(value) => CallbackCategory(value)}
              />
            </div>
          ) : product_Group && product_Category && !main_Product ? (
            <div>
              <MainProduct
                product_Group={product_Group}
                product_Category={product_Category}
                onSelectMainItem={(value) => CallbackMainItem(value)}
              />
            </div>
          ) : product_Group &&
            product_Category &&
            main_Product &&
            !sub_Product ? (
            <SubProduct
              product_Group={product_Group}
              product_Category={product_Category}
              main_Product={main_Product}
              onSelectPDF={(value) => CallPDFFile(value)}
              onSelectSubItem={(value) => CallbackSubItem(value)}
            />
          ) : (
            product_Group &&
            product_Category &&
            main_Product &&
            sub_Product && (
              <Product
                product_Group={product_Group}
                product_Category={product_Category}
                main_Product={main_Product}
                sub_Product={sub_Product}
              />
            )
          )}
        </>
      ) : (
        <div className="row mt-5 border-overflow">
          {dataSearch.map((item, index) => (
            <div className="col-3 mt-3" key={index}>
              <div
                className="border-selected mx-4 row"
                onClick={() => {
                  setSelectProductPDF(item.Path_File_PDF), setModelPDF(1);
                }}
              >
                <div className="col-4">Model :</div>
                <div className="col-8">{item.Product_name}</div>
                <div className="col-4">TOP :</div>
                <div className="col-8">{item.frame}</div>
                <div className="col-4">Modesty :</div>
                <div className="col-8">{item.Backrest}</div>
                <div className="col-4">Caster :</div>
                <div className="col-8">{item.hand}</div>
                <div className="col-4">ขา :</div>
                <div className="col-8">{item.foot}</div>
                <div className="col-4">ราคาประมาณ :</div>
                <div className="col-8">{item.Product_price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
