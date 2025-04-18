"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mainitem.css";
import Image from "next/image";

export default function Mainitem({
  product_Group,
  product_Category,
  onSelectMainItem,
}) {
  const [dataGroup, setDatagroup] = useState([]);
  const [selectProductPDF, setSelectProductPDF] = useState("");
  const [modelPDF, setModelPDF] = useState(0);
  const [select_Product, setSelect_Product] = useState("");
  const [filterMainitem, setFilterMainitem] = useState([]);
  const [product_Serie, setProduct_Serie] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5005/api/post/MainProduct`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_Group, product_Category }),
        });
        const response = await res.json();

        console.log(response);

        setDatagroup(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSelected = async (value) => {
    setSelect_Product(value);

    setFilterMainitem(dataGroup.filter((item) => item.Main_Product == value));
  };

  const uniqueDataGroup = dataGroup.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.Main_Product === item.Main_Product)
  );

  const closeModelPDF = (value) => {
    setModelPDF(value);
  };

  const FilterProduct_Serie = (value) => {
    console.log(value);
    
    setProduct_Serie(dataGroup.filter((item) => item.Product_Serie === value));
  }

  console.log(product_Serie);
  

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
      <div className="row">
        <div className="col-2 mx-3 line-show-select">
          <div className="row">
            <div className="col-12">
              <div className="box-show-select text-center mt-5">
                {product_Group}
              </div>
            </div>
            <div className="col-12">
              <div className="mt-3 text-end line-show-select-menu">
                <label className="box-show-sub">{product_Category}</label>
              </div>
            </div>
            <div className="col-12 mt-2 border-bottom"></div>
            {uniqueDataGroup.map((item, index) => (
              <div
                className="row line-show-select-menu"
                key={index}
                onClick={() => handleSelected(item.Main_Product)}
              >
                <div className="col-2 mt-3">
                  {select_Product === item.Main_Product && (
                    <Image
                      src={`/Icon/right-arrow.png`}
                      width={20}
                      height={20}
                      alt="right"
                    />
                  )}
                </div>
                <div className="col-10 mt-3">
                  <div className="cursor-pointer">
                    <div
                      className={`text-end border-select ${
                        select_Product === item.Main_Product && "select-border"
                      }`}
                    >
                      <span className="mx-3">{item.Main_Product}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-12 mt-2 border-bottom"></div>
          </div>
        </div>
        <div className={`col-8 animation-show-slide-right`}>
          <div className="row mt-3 border-overflow">
            {filterMainitem.length > 0 ? (
              <>
                {filterMainitem.map((item, index) => (
                  <div className="col-4 mt-3" key={index}>
                    <div
                      className="border-selected mx-4 row"
                      onClick={() => {
                        setSelectProductPDF(item.Path_File_PDF);
                        setModelPDF(1);
                        FilterProduct_Serie(item.Product_Serie);
                      }}
                    >
                      <div className="text-end col-5">Model :</div>
                      <div className="text-start col-7">
                        {item.Product_Serie}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {dataGroup.map((item, index) => (
                  <div className="col-4 mt-3" key={index}>
                    <div
                      className="border-selected mx-4 row"
                      onClick={() => {
                        setSelectProductPDF(item.Path_File_PDF);
                        setModelPDF(1);
                        FilterProduct_Serie(item.Product_Serie);
                      }}
                    >
                      <div className="text-end col-5">Model :</div>
                      <div className="text-start col-7">
                        {item.Product_Serie}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
