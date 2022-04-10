import React from "react";
import "./Card.css";
import ProductData from "./ProductData";

const Card = () => {
  return (
    <div className="card grid grid--auto-fit">
      {ProductData.map((product) => {
        return (
          <div
            className={
              "card-item grid__item" +
              (product.product_id % 2 ? " " : " upside")
            }
          >
            <div className="card-item-image">
              <img src={product.image} alt="" />
            </div>
            <div className="card-item-text">
              <h4>{product.product_name}</h4>
            </div>
            <div className="card-item-cost card-item-text">
              <p>{product.cost}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
