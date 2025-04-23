"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import "./category.css";

export default function Category({ product_Group, onSelectCategory }) {
  const [dataGroup, setDatagroup] = useState([]);
  const [animation, setAnimation] = useState(0);
  const [dataSearch, setDataSearch] = useState([]);
  const [textSearch, setTextSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://10.15.0.23:5005/api/post/categoryProduct`,
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
  }, [product_Group]);

  const SearchEngine = async (value) => {
    setTextSearch(value);

    const searchtext = await fetch(
      `http://10.15.0.23:5005/api/post/searchText`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Product_type: product_Group,
          TextSearch: value,
        }),
      }
    );

    const response = await searchtext.json();

    const filteredData = response.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );

    setDataSearch(filteredData); // อัปเดต state ที่นี่
  };

  const handleSelected = (value) => {
    setAnimation(1);
    setTimeout(() => {
      onSelectCategory(value);
    }, 900);
  };

  return (
    <>
      <div className="row w-100 d-flex justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="row">
            <div className="col-11">
              <input
                className="form-control"
                placeholder="Search"
                onChange={(e) => {
                  SearchEngine(e.target.value);
                }}
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
      <div className="row">
        <div className="col-2 mx-3 line-show-select animation-show-slide-left">
          <div className="box-show-select text-center mt-5">
            {product_Group}
          </div>
        </div>
        <div
          className={`col-9 animation-show-slide-right ${
            animation == 1 ? "animation-slider" : ""
          }`}
        >
          <div className="row">
            {textSearch.length > 0
              ? dataSearch.map((item, index) => (
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
                      <div className="text-center h5">
                        {item.Product_type_name}
                      </div>
                    </div>
                  </div>
                ))
              : dataGroup.map((item, index) => (
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
                      <div className="text-center h5">
                        {item.Product_type_name}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
