"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page.css";
import Product_Group from "./Product_Group/page";
import Category from "./Category/page";
import MainProduct from "./MainItem/page";
import SubProduct from "./SubItem/page";
import Product from "./Product/page";

export default function Home() {
  const [hashtags, setHashTags] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [product_Group, setProduct_Group] = useState("");
  const [product_Category, setProduct_Category] = useState("");
  const [main_Product, setMain_Product] = useState("");
  const [sub_Product, setSub_Product] = useState("");

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

  const Refresh = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="h3 text-center mt-3">Easy Product Guide</div>
      <div className="row mx-5 w-100 d-flex justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <input
            className="form-control"
            placeholder="Search"
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4 col-lg-2 mt-3 mt-md-0">
          <button className="btn btn-warning w-100" onClick={() => Refresh()}>
            Refresh
          </button>
        </div>
      </div>
      {/* <div className="row mx-5 mt-3 w-100">
        {hashtags.map((item, index) => (
          <div
            className="col-1 mx-1 hashtag-linetext cursor-pointer"
            key={index}
          >
            <div className="row p-1">
              <div
                className="col-12 text-center"
                onClick={() => del_hashtag(index)}
              >
                <label className="font-size-16-bold">{item}</label>
              </div>
            </div>
          </div>
        ))}
      </div> */}
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
      ) : product_Group && product_Category && main_Product && !sub_Product ? (
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
  );
}
