"use client";
import react, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const routes = useRouter();

  const [data, setData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [product_ID, setProduct_ID] = useState(0);
  const [selectProductValue, setSelectProductValue] = useState("");
  const [dataSelected, setDataSelected] = useState([]);
  const [focusClickSearch, setForcusClickSearch] = useState(false);
  const [hashtags, setHashTags] = useState([]);

  const [findProductPDF, setFindProductPDF] = useState([]);

  const [modelCatalog, setModelCatalog] = useState(false);

  const [pathPDF, setPathPDF] = useState("Sofa.pdf")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8001/api/get/data`);
        const result = await response.json(); // Convert response to JSON
        setData(result); // Set data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // No dependencies

  useEffect(() => {
    if (hashtags != "" && dataSelected.length === 0) {
      const fetchData = async () => {
        try {
          const getLogsearch = await fetch(
            `http://localhost:8001/api/post/log`,
            {
              method: "POST",
              headers: { "Content-Type": "Application/json" },
              body: JSON.stringify({
                hashtags,
              }),
            }
          );
          console.log(getLogsearch.json());
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [hashtags, dataSelected]);

  const FocusClickSearch = (p0: boolean) => {
    setForcusClickSearch(true);
    if (selectProductValue === "" && hashtags === "") {
      setDataSelected(data);
    }
  };

  const NextPageReport = (product_ID) => {
    routes.push(`./Report?ID=${product_ID}`);
  };

  const SelectProduct = async (value) => {
    setSelectedIndex();
    setForcusClickSearch(true);
    setSelectProductValue(value);

    try {
      const res = await fetch(`http://localhost:8001/api/post/dataProduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: value }),
      });

      const response = await res.json();
      setDataSelected(response);
    } catch (error) {
      console.error(error);
    }

    setHashTags([value]);
  };

  const Gethastag = (k) => {
    if (k.key === "Enter") {
      const newTag = k.target.value.trim();
      if (newTag && !hashtags.includes(newTag)) {
        setHashTags([...hashtags, newTag]);
      }
      k.target.value = ""; // Clear input after adding
    }
  };

  const close = (value) => {
    setHashTags(hashtags.filter((_, index) => index !== value));

    if (hashtags.length <= 1) {
      setSelectProductValue("");
      setDataSelected(data);
    }
  };

  useEffect(() => {
    if (hashtags.length > 0) {
      // แยก hashtags ที่เป็นตัวเลขออกจาก hashtags ปกติ
      const rangeprice = hashtags.find((tag) =>
        /^(\d+)\s*<>(\s*\d+)$/.test(tag)
      );
      const lessThan = hashtags.find((tag) => /^<\s*(\d+)$/.test(tag));
      const greaterThan = hashtags.find((tag) => /^>\s*(\d+)$/.test(tag));
      const normalHashtags = hashtags.filter(
        (tag) =>
          !/^(\d+)\s*<>(\s*\d+)$/.test(tag) &&
          !/^<\s*(\d+)$/.test(tag) &&
          !/^>\s*(\d+)$/.test(tag)
      );

      const filteredData = data.filter((item) => {
        const itemPrice = Number(item.Product_price);
        if (isNaN(itemPrice)) return false; // ป้องกันกรณี itemPrice ไม่ใช่ตัวเลข

        let priceCondition = true;

        // 🔍 กรองสินค้าตามช่วงราคา เช่น "5000 <> 10000"
        if (rangeprice) {
          const [_, minPrice, maxPrice] =
            rangeprice.match(/^(\d+)\s*<>(\s*\d+)$/);
          priceCondition =
            priceCondition &&
            itemPrice >= Number(minPrice) &&
            itemPrice <= Number(maxPrice);
        }

        // 🔍 กรองสินค้าราคาน้อยกว่า เช่น "< 5000"
        if (lessThan) {
          const maxPrice = Number(lessThan.match(/^<\s*(\d+)$/)[1]);
          priceCondition = priceCondition && itemPrice <= maxPrice;
        }

        // 🔍 กรองสินค้าราคามากกว่า เช่น "> 5000"
        if (greaterThan) {
          const minPrice = Number(greaterThan.match(/^>\s*(\d+)$/)[1]);
          priceCondition = priceCondition && itemPrice >= minPrice;
        }

        // 🔍 กรองตาม hashtag ปกติ (ที่ไม่ใช่ราคา)
        const hashtagCondition = normalHashtags.every((tag) =>
          Object.values(item)
            .map((value) => String(value).toLowerCase())
            .some((value) => value.includes(tag.toLowerCase()))
        );

        return priceCondition && hashtagCondition;
      });

      setDataSelected(filteredData);
    } else {
      setDataSelected(data); // ถ้าไม่มี hashtag ให้แสดงสินค้าทั้งหมด
    }
  }, [hashtags, data]);

  useEffect(() => {
    if (hashtags != "" && dataSelected.length === 0) {
      const fetchData = async () => {
        const getLogsearch = await fetch(`http://localhost:8001/api/post/log`, {
          method: "POST",
          headers: { "Contnet-Type": "Application/json" },
          body: JSON.stringify({
            hashtags,
          }),
        });

        const res = await getLogsearch.json();
      };
    }
  });

  const CatalogModel = (Type, Product_name, name_pdf) => {
    setFindProductPDF([Type, Product_name, name_pdf]);
    setModelCatalog(true);
  };

  useEffect(() => {
    if (findProductPDF[0] === "Sofa") {
      setPathPDF(`/PDF/Sofa/${findProductPDF[2]}`);
    } else if (findProductPDF[0] === "Chair") {
      setPathPDF(`/PDF/Chair/${findProductPDF[2]}`);
    } else if (findProductPDF[0] === "Table") {
      setPathPDF(`/PDF/Table/${findProductPDF[2]}`);
    }
  });

  return (
    <>
      {modelCatalog == true && (
        <>
          <div className="model-box">
            <div className="model-content">
              <div className="btn-content">
                <div className="btn-report">
                  <button
                    className="btn btn-warning mx-3"
                    onClick={() => setModelCatalog(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => NextPageReport(product_ID)}
                  >
                    ViewReport
                  </button>
                </div>
              </div>
              <iframe
                className="pdf-width"
                src={pathPDF}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </>
      )}
      <div className="border-box-search">
        <div
          className={`row ${
            focusClickSearch === true
              ? "d-flex justify-content-center animation-slide-top"
              : "d-flex justify-content-center"
          }`}
        >
          <div
            className={`w-50 col-12 ${
              focusClickSearch === true ? "" : "display-input-search"
            }`}
          >
            <div className="text-center mt-5">
              <label className="h3">Easy Product Guide</label>
            </div>
            <div className="row">
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onClick={() => FocusClickSearch(true)}
                  onKeyUp={Gethastag}
                />
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="mx-5 mt-3 d-flex justify-content-center row">
              {data
                .filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.Product_type === item.Product_type)
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className={`col-2 border-card mx-1 ${
                      selectProductValue === item.Product_type ? "active" : ""
                    }`}
                    onClick={() => SelectProduct(item.Product_type)}
                  >
                    <div className="row">
                      <div className="col-6">
                        <Image
                          src={`/${item.Product_Path_img}`}
                          className={`${
                            focusClickSearch == true
                              ? "image-size-menu"
                              : "image-menu-main"
                          }`}
                          width={1000}
                          height={1000}
                          alt={item.Product_type}
                        />
                      </div>
                      <div className="col-6 text-center h5 mt-2 align-content-center">
                        {item.Product_type}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="row">
            {hashtags.map((item, index) => (
              <div key={index} className="mx-3 w-auto box-hashtag">
                {item}{" "}
                <label
                  className="font-size-20 cursor-pointer"
                  onClick={() => close(index)}
                >
                  &times;
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      {focusClickSearch == true && (
        <div className={`line-border opcatity-animation`}>
          <div className="line-product">
            <div className="row ">
              {dataSelected.length >= 1 ? (
                dataSelected.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`col-3 cursor-pointer border ${
                        selectedIndex === index ? "active-select" : ""
                      }`}
                      onClick={() => {
                        CatalogModel(
                          item.Product_type,
                          item.Product_name,
                          item.Path_File_PDF
                        );
                        setSelectedIndex(index);
                        setProduct_ID(item.ID);
                      }}
                    >
                      <div className="product">
                        <Image
                          src={`/${item.Product_Path_img}`}
                          className="image-size"
                          width={1000}
                          height={1000}
                          alt={item.Product_type}
                        />
                      </div>
                      <div className="mt-auto border-bottom"></div>
                      <div className="border-bottom row">
                        <div className="col-4 text-end">
                          <label>Model : </label>
                        </div>
                        <div className="col-8">
                          <label>{item.Product_name}</label>
                        </div>
                      </div>
                      <div className="border-bottom row">
                        {item.Product_type === "Sofa" && (
                          <>
                            <div className="col-4 text-end">
                              <label>โครง : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.frame !== null ? item.frame : "-"}
                              </label>
                            </div>
                          </>
                        )}
                        {item.Product_type === "Chair" && (
                          <>
                            <div className="col-4 text-end">
                              <label>พนังพิง : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.frame !== null ? item.frame : "-"}
                              </label>
                            </div>
                          </>
                        )}
                        {item.Product_type === "Table" && (
                          <>
                            <div className="col-4 text-end">
                              <label>TOP : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.frame !== null ? item.frame : "-"}
                              </label>
                            </div>
                          </>
                        )}
                      </div>

                      {/* บรรทัดที่ 2  */}
                      <div className="border-bottom row">
                        {item.Product_type === "Sofa" && (
                          <>
                            <div className="col-4 text-end">
                              <label>ที่นั่ง : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.Backrest !== null ? item.Backrest : "-"}
                              </label>
                            </div>
                          </>
                        )}
                        {item.Product_type === "Chair" && (
                          <>
                            <div className="col-4 text-end">
                              <label>ที่นั่ง : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.Backrest !== null ? item.Backrest : "-"}
                              </label>
                            </div>
                          </>
                        )}
                        {item.Product_type === "Table" && (
                          <>
                            <div className="col-4 text-end">
                              <label>Modesty : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.Backrest !== null ? item.Backrest : "-"}
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                      {/* บรรทัดที่ 3  */}
                      <div className="border-bottom row">
                        {item.Product_type === "Sofa" && (
                          <>
                            <div className="col-4 text-end">
                              <label>แขน : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.hand !== null ? item.hand : "-"}
                              </label>
                            </div>
                          </>
                        )}
                        {item.Product_type === "Chair" && (
                          <>
                            <div className="col-4 text-end">
                              <label>แขน : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.hand !== null ? item.hand : "-"}
                              </label>
                            </div>
                          </>
                        )}
                        {item.Product_type === "Table" && (
                          <>
                            <div className="col-4 text-end">
                              <label>Casters : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.hand !== null ? item.hand : "-"}
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                      {/* บรรทัดที่ 4  */}
                      <div className="border-bottom row">
                        {item.Product_type === "Sofa" && (
                          <>
                            <div className="col-4 text-end">
                              <label>ขา : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.foot !== null ? item.foot : "-"}
                              </label>
                            </div>
                          </>
                        )}
                        {item.Product_type === "Chair" && (
                          <>
                            <div className="col-4 text-end">
                              <label>ขา : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.foot !== null ? item.foot : "-"}
                              </label>
                            </div>
                          </>
                        )}
                        {item.Product_type === "Table" && (
                          <>
                            <div className="col-4 text-end">
                              <label>ขา : </label>
                            </div>
                            <div className="col-8">
                              <label>
                                {item.foot !== null ? item.foot : "-"}
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="border-bottom row">
                        <div className="col-4 text-end">
                          <label>ราคาประมาณ : </label>
                        </div>
                        <div className="col-8">
                          <label>{item.Product_price.toLocaleString()}</label>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h4 text-center p-5 mt-5">
                  ไม่มีสินค้าที่เลือก
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
