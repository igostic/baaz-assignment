import React from "react";
import "./Footer.css";
import homeIcon from "../../assets/icons/home.svg";
import inventoryIcon from "../../assets/icons/inventory.svg";
import cartIcon from "../../assets/icons/cart.svg";
import profileIcon from "../../assets/icons/profile.svg";

function Footer() {
  return (
    <div class="navbar">
      <a href="#home" class="active">
        <img src={homeIcon} alt="home" />
      </a>
      <a href="#inventory">
        <img src={inventoryIcon} alt="inventory" />
      </a>
      <a href="#cart">
        {" "}
        <img src={cartIcon} alt="cart" />
      </a>
      <a href="#profile">
        <img src={profileIcon} alt="profile" />
      </a>
    </div>
  );
}
export default Footer;
