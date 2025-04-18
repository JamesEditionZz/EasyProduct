"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Product({ product_Group, product_Category, main_Product, sub_Product }) {
  const [data, setData] = useState([]);
  const [selectProductPDF, setSelectProductPDF] = useState("");
  const [modelPDF, setModelPDF] = useState(0);

  const [animation, setAnimation] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5005/api/post/Product`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_Group,
            product_Category,
            main_Product,
            sub_Product,
          }),
        });
        const response = await res.json();

        setData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {modelPDF == 1 && (
        <div className="model-subitem" onClick={() => setModelPDF(0)}>
          <div className="model-subitem-content">
            <iframe
              src="/example.pdf"
              width="100%"
              height="800px"
              style={{ border: "none" }}
            ></iframe>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-2 mx-3 line-show-select animation-show-slide-left">
          <div className="box-show-select text-center mt-5">
            {product_Group}
          </div>
          <div className="mt-3 text-end">
            <label className="box-show-sub">{product_Category}</label>
          </div>
          <div className="mt-3 text-end">
            <label className="box-show-sub">{main_Product}</label>
          </div>
          <div className="mt-3 text-end line-show-select-menu">
            <label className="box-show-sub">{sub_Product}</label>
          </div>
        </div>
        <div
          className={`col-8 animation-show-slide-right ${
            animation == 1 ? "animation-slider" : ""
          }`}
        >
          <div className="row">
            {data.map((item, index) => (
              <div
                className="col-3 mt-3"
                key={index}
                onClick={() => {
                  setSelectProductPDF(item.Path_File_PDF), setModelPDF(1);
                }}
              >
                <div className="border-selected mx-4 row">
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
        </div>
      </div>
    </>
  );
}

export default Product;
