import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [showModal, setShow] = useState(false);
  const [country, setCountry] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState("");

  const login = (userData, authToken) => {
    Cookies.set("token", authToken);
    Cookies.set("userInfo", userData);
    setUserInfo(userData);
    setToken(authToken);
  };
  let isLogin = !!Cookies.get("token");
  const logout = () => {
    setUserInfo(null);
    setToken(null);
    Cookies.remove("userInfo");
    Cookies.remove("token");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <AppContext.Provider
      value={{
        userInfo,
        token,
        login,
        handleClose,
        handleShow,
        showModal,
        isLogin,
        logout,
        country,
        setCountry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const GpState = () => {
  return useContext(AppContext);
};

export default AppProvider;
