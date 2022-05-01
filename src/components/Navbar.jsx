import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="container">
            <div className="header">
                <div className="header__logo">
                    <img
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt="Logo"
                    />
                </div>
                <div className="header__search">
                    <input type="text" placeholder="Tìm kiếm"/>
                    <i className='bx bx-search-alt-2' ></i>
                </div>
                <div className="header__login">
                    <button className="btn btn-login">Login</button>
                </div>
            </div>
        </div>
  );
}