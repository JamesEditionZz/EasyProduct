"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Group.css";
import Image from "next/image";

export default function Product_group({ onSelected }) {
  const [dataGroup, setDatagroup] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5005/api/get/groupProduct`);
        const response = await res.json();

        setDatagroup(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSelected = (value) => {
    onSelected(value);
  };

  return (
    <div>
      <div className="row">
        {dataGroup.map((item, index) => (
          <div className="col-3 p-5" key={index}>
            <div
              className="border-1 cursor-pointer bg-hover-product-group"
              onClick={() => handleSelected(item.Product_name)}
            >
              <div className="images-fullscreen">
                {/* <Image
                  src={}
                  width={1000}
                  height={1000}
                  alt={item.Product_name}
                /> */}
              </div>
              <div className="text-center h5">{item.Product_name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
