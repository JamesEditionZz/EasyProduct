"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import "./category.css";

export default function Category({ product_Group, onSelectCategory }) {
  const [dataGroup, setDatagroup] = useState([]);

  const [animation, setAnimation] = useState(0);

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
    setAnimation(1);
    setTimeout(() => {
      onSelectCategory(value);
    }, 900);
  };

  return (
    <div className="row">
      <div className="col-2 mx-3 line-show-select animation-show-slide-left">
        <div className="box-show-select text-center mt-5">{product_Group}</div>
      </div>
      <div
        className={`col-8 animation-show-slide-right ${
          animation == 1 ? "animation-slider" : ""
        }`}
      >
        <div className="row">
          {dataGroup.map((item, index) => (
            <div className="col-3 p-3" key={index}>
              <div
                className="border-1 cursor-pointer bg-hover-product-group"
                onClick={() => handleSelected(item.Product_type_name)}
              >
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
    </div>
  );
}
