import React from "react";
import Mainitem from "./Mainitem";

function page({ product_Group, product_Category, onSelectMainItem }) {
  return (
    <div>
      <Mainitem
        product_Group={product_Group}
        product_Category={product_Category}
        onSelectMainItem={onSelectMainItem}
      />
    </div>
  );
}

export default page;
