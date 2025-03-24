'use client'
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./subitem.css";
import Image from "next/image";

export default function page({
  product_Group,
  product_Category,
  main_Product,
  onSelectSubItem,
  onSelectPDF,
}) {
  const [dataGroup, setDatagroup] = useState([]);
  const [selectProductPDF, setSelectProductPDF] = useState("");
  const [modelPDF, setModelPDF] = useState(0);
  const seenSubProducts = new Set();

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

  return (
    <div>
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
            );
          }
          return null; // ถ้าเป็นค่าซ้ำ ให้ไม่ render อะไรเลย
        })}
      </div>
    </div>
  );
}
