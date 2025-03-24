'use client'
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mainitem.css";
import Image from "next/image";

export default function page({
  product_Group,
  product_Category,
  onSelectMainItem,
}) {
  const [dataGroup, setDatagroup] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5005/api/post/MainProduct`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_Group, product_Category }),
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
    onSelectMainItem(value);
  };

  return (
    <div>
      <div className="row">
        {dataGroup.map(
          (item, index) =>
            item.Main_Product != "" && (
              <div
                className="col-3 p-5"
                key={index}
                onClick={() => handleSelected(item.Main_Product)}
              >
                <div className="border-1 cursor-pointer bg-hover-product-group">
                  <div className="images-fullscreen">
                    {/* <Image
                  src={}
                  width={1000}
                  height={1000}
                  alt={item.Product_name}
                /> */}
                  </div>
                  <div className="text-center h5">{item.Main_Product}</div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
