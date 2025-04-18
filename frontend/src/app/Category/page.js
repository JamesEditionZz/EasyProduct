import React from "react";
import Category from "./Category";

function page({ product_Group, onSelectCategory }) {
  return (
    <div>
      <Category product_Group={product_Group} onSelectCategory={onSelectCategory} />
    </div>
  );
}

export default page;
