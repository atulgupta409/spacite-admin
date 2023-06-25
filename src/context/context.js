import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [showModal, setShow] = useState(false);
  const [country, setCountry] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const login = (userData, authToken) => {
    setUserInfo(userData);
    setToken(authToken);
    setIsLogin(true);
    Cookies.set("token", authToken);
    Cookies.set("userInfo", userData);
  };
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    setIsLogin(Cookies.get("token") ? true : false);
  }, [isLogin]);
  const logout = () => {
    setUserInfo(null);
    setToken(null);
    Cookies.remove("userInfo");
    Cookies.remove("token");
    setIsLogin(false);
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
        setIsLogin,
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
