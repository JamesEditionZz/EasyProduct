import React from "react";
import Subitem from "./Subitem";

function page({
  product_Group,
  product_Category,
  main_Product,
  onSelectSubItem,
}) {
  return (
    <div>
      <Subitem
        product_Group={product_Group}
        product_Category={product_Category}
        main_Product={main_Product}
        onSelectSubItem={onSelectSubItem}
      />
    </div>
  );
}

export default page;
