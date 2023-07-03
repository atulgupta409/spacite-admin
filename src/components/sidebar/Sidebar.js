import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "../login-page/spacite-logo.png";
import {
  HiOutlineBuildingOffice2,
  HiOutlineBuildingOffice,
} from "react-icons/hi2";
import { MdOutlinePermMedia, MdOutlineRealEstateAgent } from "react-icons/md";
import { IoEarthOutline } from "react-icons/io5";
import { BiMapPin } from "react-icons/bi";
import { GiModernCity } from "react-icons/gi";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineCash } from "react-icons/hi";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidenav">
        <div className="logo-sidebar">
          <img
            className=""
            style={{ width: "130px", margin: "auto" }}
            src={logo}
            alt="logo"
          />
        </div>
        <div className="nav-menu-wrapper">
          <ul className="nav">
            {/* <li className="nav-item">
              <NavLink to="/listing-space">
                <HiOutlineBuildingOffice2 className="icon" />
                Listing Space
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink to="/coworking-space">
                <HiOutlineBuildingOffice className="icon" />
                Coworking Space
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/coworking-plan">
                <HiOutlineBuildingOffice className="icon" />
                Coworking Plans
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/media">
                <MdOutlinePermMedia className="icon" />
                Media
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/country">
                <IoEarthOutline className="icon" />
                Country
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/state">
                <BiMapPin className="icon" />
                State
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/city">
                <GiModernCity className="icon" />
                City
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/microlocation">
                <IoLocationOutline className="icon" />
                Microlocation
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/amenities">
                <HiOutlineCash className="icon" />
                Amenities
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/seo">
                <MdOutlineRealEstateAgent className="icon" />
                SEO
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/brands">
                <MdOutlineRealEstateAgent className="icon" />
                Brand
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/clients">
                <MdOutlineRealEstateAgent className="icon" />
                Our Clients
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
