import React from "react";

function page() {
  return (
    <>
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
                      <label>{item.frame !== null ? item.frame : "-"}</label>
                    </div>
                  </>
                )}
                {(item.Product_type === "Chair" ||
                  item.Product_type === "Auditorium") && (
                  <>
                    <div className="col-4 text-end">
                      <label>พนังพิง : </label>
                    </div>
                    <div className="col-8">
                      <label>{item.frame !== null ? item.frame : "-"}</label>
                    </div>
                  </>
                )}
                {item.Product_type === "Table" && (
                  <>
                    <div className="col-4 text-end">
                      <label>TOP : </label>
                    </div>
                    <div className="col-8">
                      <label>{item.frame !== null ? item.frame : "-"}</label>
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
                {(item.Product_type === "Chair" ||
                  item.Product_type === "Auditorium") && (
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
                      <label>{item.hand !== null ? item.hand : "-"}</label>
                    </div>
                  </>
                )}
                {(item.Product_type === "Chair" ||
                  item.Product_type === "Auditorium") && (
                  <>
                    <div className="col-4 text-end">
                      <label>แขน : </label>
                    </div>
                    <div className="col-8">
                      <label>{item.hand !== null ? item.hand : "-"}</label>
                    </div>
                  </>
                )}
                {item.Product_type === "Table" && (
                  <>
                    <div className="col-4 text-end">
                      <label>Casters : </label>
                    </div>
                    <div className="col-8">
                      <label>{item.hand !== null ? item.hand : "-"}</label>
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
                      <label>{item.foot !== null ? item.foot : "-"}</label>
                    </div>
                  </>
                )}
                {(item.Product_type == "Chair" ||
                  item.Product_type == "Auditorium") && (
                  <>
                    <div className="col-4 text-end">
                      <label>ขา : </label>
                    </div>
                    <div className="col-8">
                      <label>{item.foot !== null ? item.foot : "-"}</label>
                    </div>
                  </>
                )}
                {item.Product_type === "Table" && (
                  <>
                    <div className="col-4 text-end">
                      <label>ขา : </label>
                    </div>
                    <div className="col-8">
                      <label>{item.foot !== null ? item.foot : "-"}</label>
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
        <div className="h4 text-center p-5 mt-5">ไม่มีสินค้าที่เลือก</div>
      )}
    </>
  );
}

export default page;
