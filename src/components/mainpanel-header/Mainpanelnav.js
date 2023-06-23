import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Mainpanelnav.css";
import { useNavigate } from "react-router-dom";
import { GpState } from "../../context/context";

function Mainpanelnav() {
  const navigate = useNavigate();
  let { isLogin } = GpState();
  let url = window.location.href;
  let splitUrl = url.split("/");
  let title = splitUrl[splitUrl.length - 1];
  let title2 = splitUrl[splitUrl.length - 2];
  if (title === "") {
    title = "Commercial Properties";
  } else if (title2.startsWith("edit")) {
    title = title2;
  } else {
    title = title;
  }
  const logoutHandle = () => {
    localStorage.removeItem("token");
    isLogin = false;
    navigate("/", { replace: true });
  };

  return (
    <div>
      <div className="mainpanel-nav d-flex justify-content-between">
        <p style={{ fontSize: "21px", textTransform: "capitalize" }}>
          {title.replace("-", " ")}
        </p>
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserCircle className="mainpanel-icon" />
          </button>
          <ul className="dropdown-menu p-0">
            <li>
              <a className="dropdown-item" href="#" onClick={logoutHandle}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Mainpanelnav;
