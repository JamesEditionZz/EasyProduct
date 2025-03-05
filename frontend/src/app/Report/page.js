'use client';
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "./report.css";

function Report() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("ID");
  const [dataProduct, setDataProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!data) return;

      try {
        const response = await fetch("http://10.15.0.23:5005/api/get/dataReport", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ID: data }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const product = await response.json();
        setDataProduct(product);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  const formattedDate = new Date().toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
  });

  const finaltime = new Date();
  finaltime.setMonth(finaltime.getMonth() + 3);
  const finaltimesale = finaltime.toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
  });

  const btnBackPage = () => {
    router.push("../");
  };

  const btnPrint = () => {
    window.print();
  };

  return (
    <>
      <div className="d-flex fixed-top mt-5">
        <button className="btn btn-danger mx-5" onClick={btnBackPage}>
          ย้อนกลับ
        </button>
        <button className="btn btn-warning mx-5" onClick={btnPrint}>
          Print
        </button>
      </div>
      <div id="pdf-content" className="width-print">
        <div className="row">
          <div className="d-flex justify-content-between col-12 ptk-font-header">
            <label>
              <Image src={`/Logo/logo.png`} width={100} height={50} alt="logo" />
            </label>
            <label>{formattedDate}</label>
          </div>
          <div className="col-12 ptk-border-fixed">
            <div className="row mt-3">
              <div className="col-4"></div>
              <div className="col-4">
                {dataProduct.length > 0 && dataProduct[0]?.Product_Path_img && (
                  <Image
                    src={`/${dataProduct[0].Product_Path_img}`}
                    className="img-width"
                    width={1000}
                    height={1000}
                    alt="Product Image"
                  />
                )}
              </div>
              <div className="col-4"></div>
            </div>
          </div>
          <div className="col-12 ptk-font-description mt-3 ptk-line-header">
            FEATURES
          </div>
          <div className="ptk-line-header"></div>
          <div className="col-12 ptk-font-description margin-description ptk-line-header">
            DESCRIPTIONS
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">ราคาเฟอร์นิเจอร์</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">
              {dataProduct[0]?.Product_price?.toLocaleString() || "N/A"} บาท
            </div>
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">ภาษีมูลค่าเพิ่ม</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">หัก ณ ที่จ่าย</div>
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">
              ราคาเสนอรวมทั้งสิ้น
            </div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">
              {dataProduct[0]?.Product_price?.toLocaleString() || "N/A"} บาท
            </div>
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">กำหนดยืนราคา</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">{finaltimesale}</div>
          </div>
          <div className="line-space-1"></div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">พนักพิง</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">XXXXXXXXXX</div>
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">เบาะนั่ง</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">XXXXXXXXXX</div>
          </div>
          <div className="line-space-2"></div>
        </div>
      </div>
    </>
  );
}

export default Report;

