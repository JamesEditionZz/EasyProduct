"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mainitem.css";
import Image from "next/image";

export default function Mainitem({ product_Group, product_Category }) {
  const [dataGroup, setDatagroup] = useState([]);
  const [selectProductPDF, setSelectProductPDF] = useState("");
  const [modelPDF, setModelPDF] = useState(0);
  const [select_Product, setSelect_Product] = useState("");
  const [filterMainitem, setFilterMainitem] = useState([]);
  const [product_Serie, setProduct_Serie] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [textSearch, setTextSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://10.15.0.23:5005/api/post/MainProduct`, {
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
  }, [product_Group, product_Category]);

  const SearchEngine = async (value) => {
    setTextSearch(value);

    const searchtext = await fetch(
      `http://10.15.0.23:5005/api/post/searchText`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Product_type: product_Group,
          Product_type_name: product_Category,
          Product_Serie: select_Product,
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

  const FilterProduct_Serie = async (value1, value2) => {
    const res = await fetch(`http://10.15.0.23:5005/api/post/Product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Product_Serie: value1,
        Product_type_name: value2
      }),
    });
    const response = await res.json();

    setProduct_Serie(response);
  };
  
  return (
    <>
      {modelPDF == 1 && (
        <div className="model-subitem" onClick={() => closeModelPDF(0)}>
          <div
            className="model-subitem-content animation-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="row mx-3 mt-4">
              <div className="col-8 border animation-opacity table-overflow">
                <iframe
                  src={`http://10.15.0.23:5005/api/pdf?path=${encodeURIComponent(selectProductPDF)}`}
                  width="100%"
                  height="800px"
                  style={{ border: "none" }}
                  alt="pdf"
                ></iframe>
              </div>
              <div className="col-4 animation-opacity table-overflow">
                <table className="table table-bordered">
                  <thead className="table-primary">
                    <tr className="text-center">
                      <th>FG</th>
                      <th>Reg No.</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  {product_Serie.map((item, index) => (
                    <tbody key={index} className="table-secondary text-center">
                      <tr>
                        <td>{item.Product_FG}</td>
                        <td>{item.Product_name}</td>
                        <td>{item.Product_price.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
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
                      className={`text-end border-select ${select_Product === item.Main_Product && "select-border"
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
            {filterMainitem.length > 0 && textSearch.length == 0 ? (
              <>
                {filterMainitem.map((item, index) => (
                  <div className="col-4 mt-3" key={index}>
                    <div
                      className="border-selected mx-4 row"
                      onClick={() => {
                        setSelectProductPDF(item.Path_File_PDF);
                        setModelPDF(1);
                        FilterProduct_Serie(item.Product_Serie, item.Product_type_name);
                      }}
                    >
                      <div className="col-12">
                        <div className="row">
                          <div className="col-2"></div>
                          <div className="col-8">
                            <Image className="picture-product"
                              src={`http://10.15.0.23:5005/api/image?path=${encodeURIComponent(item.Product_Path_img)}`}
                              width={1000}
                              height={1000}
                              alt={item.Product_Serie}
                              style={{ width: '100%', height: '150px', overflow: 'hidden' }}
                            />
                          </div>
                          <div className="col-2 p-2"></div>
                          <div className="text-end col-5 p-3">Model :</div>
                          <div className="text-start col-7 p-3">{item.Product_Serie}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : textSearch.length > 0 ? (
              <>
                {dataSearch.map((item, index) => (
                  <div className="col-4 mt-3" key={index}>
                    <div
                      className="border-selected mx-4 row"
                      onClick={() => {
                        setSelectProductPDF(item.Path_File_PDF);
                        setModelPDF(1);
                        FilterProduct_Serie(item.Product_Serie, item.Product_type_name);
                      }}
                    >
                      <div className="col-12">
                        <div className="row">
                          <div className="col-2"></div>
                          <div className="col-8">
                            <Image className="picture-product"
                              src={`http://10.15.0.23:5005/api/image?path=${encodeURIComponent(item.Product_Path_img)}`}
                              width={1000}
                              height={1000}
                              alt={item.Product_Serie}
                              style={{ width: '100%', height: '150px', overflow: 'hidden' }}
                            />
                          </div>
                          <div className="col-2 p-2"></div>
                          <div className="text-end col-5 p-3">Model :</div>
                          <div className="text-start col-7 p-3">{item.Product_Serie}
                          </div>
                        </div>
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
                        FilterProduct_Serie(item.Product_Serie, item.Product_type_name);
                      }}
                    >
                      <div className="col-12">
                        <div className="row">
                          <div className="col-2"></div>
                          <div className="col-8">
                            <Image className="picture-product"
                              src={`http://10.15.0.23:5005/api/image?path=${encodeURIComponent(item.Product_Path_img)}`}
                              width={1000}
                              height={1000}
                              alt={item.Product_Serie}
                              style={{ width: '100%', height: '150px', overflow: 'hidden' }}
                            />
                          </div>
                          <div className="col-2 p-2"></div>
                          <div className="text-end col-5 p-3">Model :</div>
                          <div className="text-start col-7 p-3">{item.Product_Serie}
                          </div>
                        </div>
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
