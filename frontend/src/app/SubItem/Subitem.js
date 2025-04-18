"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./subitem.css";
import Image from "next/image";

export default function Subitem({
  product_Group,
  product_Category,
  main_Product,
  onSelectSubItem,
}) {
  const [dataGroup, setDatagroup] = useState([]);
  const [selectProductPDF, setSelectProductPDF] = useState("");
  const [modelPDF, setModelPDF] = useState(0);
  const seenSubProducts = new Set();

  const [animation, setAnimation] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5005/api/post/SubProduct`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_Group,
            product_Category,
            main_Product,
          }),
        });
        const response = await res.json();

        setDatagroup(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSelected = (value) => {
    onSelectSubItem(value);
  };
  
  const closeModelPDF = (value) => {
    setModelPDF(value);
  }

  return (
    <div>
      {modelPDF == 1 && (
        <div className="model-subitem" onClick={() => closeModelPDF(0)}>
          <div className="model-subitem-content animation-content" onClick={(e) => e.stopPropagation()}>
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
          <div className="box-show-select text-center mt-5">
            {product_Group}
          </div>
          <div className="mt-3 text-end">
            <label className="box-show-sub">{product_Category}</label>
          </div>
          <div className="mt-3 text-end line-show-select-menu">
            <label className="box-show-sub">{main_Product}</label>
          </div>
        </div>
        <div
          className={`col-9 animation-show-slide-right ${
            animation == 1 ? "animation-slider" : ""
          }`}
        >
          <div
            className={`row mt-3 ${
              dataGroup.length > 10 ? "border-overflow" : ""
            }`}
          >
            {dataGroup.map((item, index) => {
              if (
                item.Sub_Product !== "" &&
                !seenSubProducts.has(item.Sub_Product)
              ) {
                seenSubProducts.add(item.Sub_Product); // บันทึกค่าที่ใช้ไปแล้ว
                return (
                  <div
                    className="col-3 p-5"
                    key={index}
                    onClick={() => handleSelected(item.Sub_Product)}
                  >
                    <div className="border-1 cursor-pointer bg-hover-product-group">
                      <div className="images-fullscreen">
                        {/* <Image src={} width={1000} height={1000} alt={item.Product_name} /> */}
                      </div>
                      <div className="text-center h5">{item.Sub_Product}</div>
                    </div>
                  </div>
                );
              } else if (item.Sub_Product === "") {
                return (
                  <div className="col-4 mt-3" key={index}>
                    <div
                      className="border-selected mx-4 row"
                      onClick={() => {
                        setSelectProductPDF(item.Path_File_PDF), setModelPDF(1);
                      }}
                    >
                      <div className="text-end col-5">Model :</div>
                      <div className="text-start col-7">
                        {item.Product_name}
                      </div>
                      <div className="text-end col-5">TOP :</div>
                      <div className="text-start col-7">{item.frame}</div>
                      <div className="text-end col-5">Modesty :</div>
                      <div className="text-start col-7">{item.Backrest}</div>
                      <div className="text-end col-5">Caster :</div>
                      <div className="text-start col-7">{item.hand}</div>
                      <div className="text-end col-5">ขา :</div>
                      <div className="text-start col-7">{item.foot}</div>
                      <div className="text-end col-5">ราคาประมาณ :</div>
                      <div className="text-start col-7">
                        {item.Product_price}
                      </div>
                    </div>
                  </div>
                );
              }
              return null; // ถ้าเป็นค่าซ้ำ ให้ไม่ render อะไรเลย
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
