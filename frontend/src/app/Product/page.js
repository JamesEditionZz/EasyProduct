import React from "react";
import Product from "./Product";

function page({ product_Group, product_Category, main_Product, sub_Product }) {
  return (
    <div>
      <Product
        product_Group={product_Group}
        product_Category={product_Category}
        main_Product={main_Product}
        sub_Product={sub_Product}
      />
    </div>
  );
}

export default page;
