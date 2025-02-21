"use client";
import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import "./report.css";

type ProductFeature = {
  Product_Path_img: string; // เพิ่มฟิลด์ที่คุณต้องการเข้าถึง
  Product_img: string;
  // เพิ่มฟิลด์อื่นๆ ที่ต้องการ
};

function index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("ID");
  const [dataProduct, setDataProduct] = useState([]);

  useEffect(() => {
    const fecthdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/api/get/dataReport`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ID: data }),
          }
        );

        const res = await response.json();
        setDataProduct(res);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    };
    fecthdata();
  }, [data]);

  console.log(dataProduct);
  

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
  });

  const finaltime = new Date();
  finaltime.setMonth(finaltime.getMonth() + 3);
  const finaltimesale = finaltime.toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
  });

  const Product_img = dataProduct[0]?.Product_img?.replace(/\\/g, "/");

  const btnbackpage = () => {
    router.push(`../`)
  }

  const btnPrint = () => {
    window.print();
  }

  return (
    <>
      <div className="d-flex fixed-top mt-5">
        <button className="btn btn-danger mx-5" onClick={() => btnbackpage()}>
          ย้อนกลับ
        </button>
        <button className="btn btn-warning mx-5" onClick={() => btnPrint()}>
          Print
        </button>
      </div>
      <div id="pdf-content" className="width-print">
        <div className="row">
          <div className="d-flex justify-content-between col-12 ptk-font-header">
            <label><Image src={`/Logo/logo.png`} width={100} height={50} alt="logo" /></label> <label>{formattedDate}</label>
          </div>
          <div className="col-12 ptk-border-fixed">
            <div className="row mt-3">
              <div className="col-4"></div>
              <div className="col-4">
                <Image
                  src={`/${dataProduct[0]?.Product_Path_img}`}
                  className="img-width"
                  width={1000}
                  height={1000}
                  alt=""
                />
              </div>
              <div className="col-4"></div>
            </div>
          </div>
          <div className="col-12 ptk-font-description mt-3 ptk-line-header">
            FEATURES
          </div>
          {dataProduct.map((item, index) => (
            <div className="col-4 ptk-font-description" key={index}>
              {item.Feature_name}
            </div>
          ))}
          <div className="ptk-line-header"></div>
          <div className="col-12 ptk-font-description margin-description ptk-line-header">
            DESCRIPTIONS
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">ราคาเฟอร์นิเจอร์</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">
              {dataProduct[0]?.Product_price.toLocaleString()} บาท
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
              {dataProduct[0]?.Product_price.toLocaleString()} บาท
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

export default index;
