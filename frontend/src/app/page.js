"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const routes = useRouter();

  const [allDataProduct, setAllDataProduct] = useState([]);
  const [datagroup, setDatagroup] = useState([]);
  const [dataProduct_type, setDataProduct_Type] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [selectProduct, setSelectProduct] = useState(false);

  const [hashtags, setHashTags] = useState([]);
  const [valueSearchProduct, setValueSearchProduct] = useState("");
  const [valueSearch, setValueSearch] = useState("");

  const [modelPDF, setModelPDF] = useState(false);

  const [viewPDF, setViewPDF] = useState("");

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

  const SelectGroupProduct = async (groupname) => {
    setHashTags([groupname]);
    try {
      const res = await fetch(
        `http://localhost:5005/api/post/categoryProduct`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ groupname }),
        }
      );

      const response = await res.json();

      setDataProduct_Type(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = async (value) => {
    setHashTags([...hashtags, value]);
    try {
      setSelectProduct(true);
      const res = await fetch(`http://localhost:5005/api/post/Product`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ value }),
      });

      const response = await res.json();

      setDataProduct(response);

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const ViewSeePDF = (type, nameFilePDF) => {
    setModelPDF(true);
    setViewPDF(`/PDF/${type}/${nameFilePDF}`);
  };

  const closeModel = () => {
    setModelPDF(false);
  };

  const del_hashtag = (index) => {
    setHashTags((prevHashtags) => {
      const newHashtags = prevHashtags.filter((_, i) => i !== index);
      if (newHashtags.length < prevHashtags.length) {
        setSelectProduct(false);
      }

      return newHashtags;
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (hashtags.length === 0) {
        setSelectProduct(false);
        setDataProduct_Type("");

        if (allDataProduct.length > 0) {
          try {
            const res = await fetch(`http://localhost:5005/api/get/Product`);
            const response = await res.json();
            setValueSearchProduct(response);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        }
      }
    };

    fetchProducts();
  }, [hashtags]); // รันใหม่เมื่อ hashtags เปลี่ยนค่า

  const searchProduct = async () => {
    const res = await fetch(`http://localhost:5005/api/get/Product`);
    const response = await res.json();

    setAllDataProduct(response);
  };

  const Refresh = () => {
    window.location.reload();
  };

  const ValueSearch = async (e) => {
    if (valueSearch.trim() !== "" && !hashtags.includes(valueSearch)) {
      // เพิ่ม valueSearch เข้าไปใน hashtags
      const updatedHashtags = [...hashtags, valueSearch];
      setHashTags(updatedHashtags);
      setValueSearch("");

      const res = await fetch(`http://localhost:5005/api/get/Product`);
      const response = await res.json();

      if (Array.isArray(response)) {
        const filteredProducts = response.filter((item) => {
          // แปลงทุกค่าใน item ให้เป็นตัวพิมพ์เล็ก และรวมกันเป็นสตริงเดียว
          const itemString = Object.values(item)
            .map((value) =>
              typeof value === "string" ? value.toLowerCase() : ""
            )
            .join(" "); // รวมค่าทั้งหมดเป็นข้อความเดียว

          // ตรวจสอบว่าทุกแฮชแท็ก (ทุกคำใน updatedHashtags) มีอยู่ใน itemString หรือไม่
          return updatedHashtags.every((tag) =>
            itemString.includes(tag.toLowerCase())
          );
        });

        if (filteredProducts.length > 0) {
          setValueSearchProduct(filteredProducts);
        } else {
          const res = await fetch(`http://localhost:5005/api/post/Log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hashtags }),
          });

          const response = await res.json();

          console.log(response);
        }
      }
    }
  };

  return (
    <>
      {modelPDF === true && (
        <div className="model" onClick={closeModel}>
          <div className="model-content">
            <iframe src={viewPDF} width="100%" height="100%" />
          </div>
        </div>
      )}
      <div className="h3 text-center mt-3">Easy Product Guide</div>
      <div className="row mx-5 w-100 d-flex justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <input
            className="form-control"
            placeholder="Search"
            value={valueSearch}
            onClick={() => searchProduct()}
            onChange={(e) => setValueSearch(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                ValueSearch(e);
              }
            }}
          />
        </div>
        <div className="col-12 col-md-4 col-lg-2 mt-3 mt-md-0">
          <button className="btn btn-warning w-100" onClick={() => Refresh()}>
            Refresh
          </button>
        </div>
      </div>

      <div className="row mx-5 mt-3 w-100">
        {hashtags.map((item, index) => (
          <div
            className="col-1 mx-1 hashtag-linetext cursor-pointer"
            key={index}
          >
            <div className="row p-1">
              <div
                className="col-12 text-center"
                onClick={() => del_hashtag(index)}
              >
                <label className="font-size-16-bold">{item}</label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        {allDataProduct.length > 0 ? (
          <>
            <div className="box-border-list">
              <div className="row">
                {allDataProduct.length > 0 && hashtags.length == 0 ? (
                  <>
                    {allDataProduct.map((item, index) => (
                      <div className="col-3" key={index}>
                        <div
                          className="row line-product p-3"
                          onClick={() =>
                            ViewSeePDF(item.Product_type, item.Path_File_PDF)
                          }
                        >
                          <div className="col-12 d-flex justify-content-center">
                            <Image
                              className="image-menu-main"
                              src={`/${item.Product_Path_img}`}
                              width={1000}
                              height={1000}
                              alt={`${item.Product_type_name}`}
                            />
                          </div>
                          <div className="col-12">
                            <div className="row">
                              <div className="col-4 text-end">
                                <label>Model : </label>
                              </div>
                              <div className="col-8">
                                <label>{item.Product_name}</label>
                              </div>
                              <div className="col-4 text-end">
                                {item.Product_type === "Chair" ? (
                                  <label>พนังพิง : </label>
                                ) : item.Product_type === "Table" ? (
                                  <label>TOP : </label>
                                ) : item.Product_type === "Sofa" ? (
                                  <label>โครง : </label>
                                ) : (
                                  item.Product_type === "Auditorium" && (
                                    <label>โครงหลัง : </label>
                                  )
                                )}
                              </div>
                              <div className="col-8">
                                <label>{item.frame}</label>
                              </div>
                              <div className="col-4 text-end">
                                {item.Product_type === "Chair" ? (
                                  <label>ที่นั่ง : </label>
                                ) : item.Product_type === "Table" ? (
                                  <label>Modest : </label>
                                ) : item.Product_type === "Sofa" ? (
                                  <label>พนังพิง / ที่นั่ง : </label>
                                ) : (
                                  item.Product_type === "Auditorium" && (
                                    <label>พนังพิง / ที่นั่ง : </label>
                                  )
                                )}
                              </div>
                              <div className="col-8">
                                <label>{item.Backrest}</label>
                              </div>
                              <div className="col-4 text-end">
                                {item.Product_type === "Chair" ? (
                                  <label>แขน : </label>
                                ) : item.Product_type === "Table" ? (
                                  <label>ขา : </label>
                                ) : item.Product_type === "Sofa" ? (
                                  <label>แขน : </label>
                                ) : (
                                  item.Product_type === "Auditorium" && (
                                    <label>แขน : </label>
                                  )
                                )}
                              </div>
                              <div className="col-8">
                                <label>{item.hand}</label>
                              </div>
                              <div className="col-4 text-end">
                                {item.Product_type === "Chair" ? (
                                  <label>ขา : </label>
                                ) : item.Product_type === "Table" ? (
                                  <label>Casters : </label>
                                ) : item.Product_type === "Sofa" ? (
                                  <label>ขา : </label>
                                ) : (
                                  item.Product_type === "Auditorium" && (
                                    <label>ขา : </label>
                                  )
                                )}
                              </div>
                              <div className="col-8">
                                <label>{item.foot}</label>
                              </div>
                              <div className="col-4 text-end">
                                <label>ราคาประมาณ : </label>
                              </div>
                              <div className="col-8">
                                <label>
                                  {!item.Product_price
                                    ? "0"
                                    : item.Product_price.toLocaleString()}
                                </label>
                              </div>
                              <div className="col-4 text-end">
                                <label>FG</label>
                              </div>
                              <div className="col-8">
                                <label>
                                  {!item.Product_FG ? "-" : item.Product_FG}
                                </label>
                              </div>
                              <div className="col-4 text-end">
                                <label>Price Validity</label>
                              </div>
                              <div className="col-8">
                                <label>
                                  {!item.Price_Validity
                                    ? "-"
                                    : item.Price_Validity}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {valueSearchProduct.length > 0 && hashtags.length > 0 ? (
                      <>
                        {valueSearchProduct.map((item, index) => (
                          <div className="col-3" key={index}>
                            <div
                              className="row line-product p-3"
                              onClick={() =>
                                ViewSeePDF(
                                  item.Product_type,
                                  item.Path_File_PDF
                                )
                              }
                            >
                              <div className="col-12 d-flex justify-content-center">
                                <Image
                                  className="image-menu-main"
                                  src={`/${item.Product_Path_img}`}
                                  width={1000}
                                  height={1000}
                                  alt={`${item.Product_type_name}`}
                                />
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col-4 text-end">
                                    <label>Model : </label>
                                  </div>
                                  <div className="col-8">
                                    <label>{item.Product_name}</label>
                                  </div>
                                  <div className="col-4 text-end">
                                    {item.Product_type === "Chair" ? (
                                      <label>พนังพิง : </label>
                                    ) : item.Product_type === "Table" ? (
                                      <label>TOP : </label>
                                    ) : item.Product_type === "Sofa" ? (
                                      <label>โครง : </label>
                                    ) : (
                                      item.Product_type === "Auditorium" && (
                                        <label>โครงหลัง : </label>
                                      )
                                    )}
                                  </div>
                                  <div className="col-8">
                                    <label>{item.frame}</label>
                                  </div>
                                  <div className="col-4 text-end">
                                    {item.Product_type === "Chair" ? (
                                      <label>ที่นั่ง : </label>
                                    ) : item.Product_type === "Table" ? (
                                      <label>Modest : </label>
                                    ) : item.Product_type === "Sofa" ? (
                                      <label>พนังพิง / ที่นั่ง : </label>
                                    ) : (
                                      item.Product_type === "Auditorium" && (
                                        <label>พนังพิง / ที่นั่ง : </label>
                                      )
                                    )}
                                  </div>
                                  <div className="col-8">
                                    <label>{item.Backrest}</label>
                                  </div>
                                  <div className="col-4 text-end">
                                    {item.Product_type === "Chair" ? (
                                      <label>แขน : </label>
                                    ) : item.Product_type === "Table" ? (
                                      <label>ขา : </label>
                                    ) : item.Product_type === "Sofa" ? (
                                      <label>แขน : </label>
                                    ) : (
                                      item.Product_type === "Auditorium" && (
                                        <label>แขน : </label>
                                      )
                                    )}
                                  </div>
                                  <div className="col-8">
                                    <label>{item.hand}</label>
                                  </div>
                                  <div className="col-4 text-end">
                                    {item.Product_type === "Chair" ? (
                                      <label>ขา : </label>
                                    ) : item.Product_type === "Table" ? (
                                      <label>Casters : </label>
                                    ) : item.Product_type === "Sofa" ? (
                                      <label>ขา : </label>
                                    ) : (
                                      item.Product_type === "Auditorium" && (
                                        <label>ขา : </label>
                                      )
                                    )}
                                  </div>
                                  <div className="col-8">
                                    <label>{item.foot}</label>
                                  </div>
                                  <div className="col-4 text-end">
                                    <label>ราคาประมาณ : </label>
                                  </div>
                                  <div className="col-8">
                                    <label>
                                      {!item.Product_price
                                        ? "0"
                                        : item.Product_price.toLocaleString()}
                                    </label>
                                  </div>
                                  <div className="col-4 text-end">
                                    <label>FG</label>
                                  </div>
                                  <div className="col-8">
                                    <label>
                                      {!item.Product_FG ? "-" : item.Product_FG}
                                    </label>
                                  </div>
                                  <div className="col-4 text-end">
                                    <label>Price Validity</label>
                                  </div>
                                  <div className="col-8">
                                    <label>
                                      {!item.Price_Validity
                                        ? "-"
                                        : item.Price_Validity}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center align-self-center h3 mt-3">
                        ไม่มีสินค้าที่เลือก
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : selectProduct == false && dataProduct_type.length == 0 ? (
          <>
            {datagroup.map((item, index) => (
              <div className="col-3 d-flex justify-content-center" key={index}>
                <div
                  className="row mt-3 line-border"
                  onClick={() => SelectGroupProduct(item.Product_type)}
                >
                  <div className="col-12 d-flex justify-content-center mb-4 mt-3">
                    <Image
                      className="image-menu-main"
                      src={`/${item.Product_Path_img}`}
                      width={1000}
                      height={1000}
                      alt={`${item.Product_name}`}
                    />
                  </div>
                  <div className="col-12 text-center h5">
                    {item.Product_name}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : selectProduct == false ? (
          <>
            {dataProduct_type.map((item, index) => (
              <div className="col-3 d-flex justify-content-center" key={index}>
                <div
                  className="row mt-3 line-border"
                  onClick={() => handleSelect(item.Product_type_name)}
                >
                  <div className="col-12 d-flex justify-content-center mb-4 mt-3">
                    <Image
                      className="image-menu-main"
                      src={`/${item.Product_Path_img}`}
                      width={1000}
                      height={1000}
                      alt={`${item.Product_type_name}`}
                    />
                  </div>
                  <div className="col-12 text-center h5">
                    {item.Product_type_name}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          selectProduct == true && (
            <>
              <div className="box-border-list">
                <div className="row">
                  {dataProduct.map((item, index) => (
                    <div className="col-3" key={index}>
                      <div
                        className="row line-product p-3"
                        onClick={() =>
                          ViewSeePDF(item.Product_type, item.Path_File_PDF)
                        }
                      >
                        <div className="col-12 d-flex justify-content-center">
                          <Image
                            className="image-menu-main"
                            src={`/${item.Product_Path_img}`}
                            width={1000}
                            height={1000}
                            alt={`${item.Product_type_name}`}
                          />
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="col-4 text-end">
                              <label>Model : </label>
                            </div>
                            <div className="col-8">
                              <label>{item.Product_name}</label>
                            </div>
                            <div className="col-4 text-end">
                              {item.Product_type === "Chair" ? (
                                <label>พนังพิง : </label>
                              ) : item.Product_type === "Table" ? (
                                <label>TOP : </label>
                              ) : item.Product_type === "Sofa" ? (
                                <label>โครง : </label>
                              ) : (
                                item.Product_type === "Auditorium" && (
                                  <label>โครงหลัง : </label>
                                )
                              )}
                            </div>
                            <div className="col-8">
                              <label>{item.frame}</label>
                            </div>
                            <div className="col-4 text-end">
                              {item.Product_type === "Chair" ? (
                                <label>ที่นั่ง : </label>
                              ) : item.Product_type === "Table" ? (
                                <label>Modest : </label>
                              ) : item.Product_type === "Sofa" ? (
                                <label>พนังพิง / ที่นั่ง : </label>
                              ) : (
                                item.Product_type === "Auditorium" && (
                                  <label>พนังพิง / ที่นั่ง : </label>
                                )
                              )}
                            </div>
                            <div className="col-8">
                              <label>{item.Backrest}</label>
                            </div>
                            <div className="col-4 text-end">
                              {item.Product_type === "Chair" ? (
                                <label>แขน : </label>
                              ) : item.Product_type === "Table" ? (
                                <label>ขา : </label>
                              ) : item.Product_type === "Sofa" ? (
                                <label>แขน : </label>
                              ) : (
                                item.Product_type === "Auditorium" && (
                                  <label>แขน : </label>
                                )
                              )}
                            </div>
                            <div className="col-8">
                              <label>{item.hand}</label>
                            </div>
                            <div className="col-4 text-end">
                              {item.Product_type === "Chair" ? (
                                <label>ขา : </label>
                              ) : item.Product_type === "Table" ? (
                                <label>Casters : </label>
                              ) : item.Product_type === "Sofa" ? (
                                <label>ขา : </label>
                              ) : (
                                item.Product_type === "Auditorium" && (
                                  <label>ขา : </label>
                                )
                              )}
                            </div>
                            <div className="col-8">
                              <label>{item.foot}</label>
                            </div>
                            <div className="col-4 text-end">
                              <label>ราคาประมาณ : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {!item.Product_price
                                  ? "0"
                                  : item.Product_price.toLocaleString()}
                              </label>
                            </div>
                            <div className="col-4 text-end">
                              <label>FG</label>
                            </div>
                            <div className="col-8">
                              <label>
                                {!item.Product_FG ? "-" : item.Product_FG}
                              </label>
                            </div>
                            <div className="col-4 text-end">
                              <label>Price Validity</label>
                            </div>
                            <div className="col-8">
                              <label>
                                {!item.Price_Validity
                                  ? "-"
                                  : item.Price_Validity}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </>
  );
}
