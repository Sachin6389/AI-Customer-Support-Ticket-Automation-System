import React, { useEffect, useState } from "react";
import ProductDisplay from "./ProductDisplay.jsx";
import Tittle from "./Tittle.jsx";
import { useSelector } from "react-redux";

function RelatedProduct({ category }) {
  const { productList, loading } = useSelector((state) => state.product);
  
  
  
  

  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (productList && category) {
      let filtered = productList.filter(
        (item) => item.companyName === category
      );

      setRelated(filtered.slice(0, 5));
    }
  }, [productList, category]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Tittle text1={"Related "} text2={"Products"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <ProductDisplay
            key={index}
            id={item._id}
            price={item.price}
            name={item.name}
            image={item.FrontImage}
          />
        ))}
      </div>
    </div>
  );
}

export default RelatedProduct;