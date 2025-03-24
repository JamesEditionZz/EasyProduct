'use client'
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";

export default function page({ product_Group, onSelectCategory }) {
  const [dataGroup, setDatagroup] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5005/api/post/categoryProduct`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupname: product_Group }),
          }
        );
        const response = await res.json();

        setDatagroup(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSelected = (value) => {
    onSelectCategory(value)
  }

  return (
    <div>
      <div className="row">
        {dataGroup.map((item, index) => (
          <div
            className="col-3 p-5"
            key={index}
            onClick={() => handleSelected(item.Product_type_name)}
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
              <div className="text-center h5">{item.Product_type_name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
