import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import ListingSpace from "./components/listing-space/ListingSpace";
import CoworkingPlan from "./components/coworking-plans/CoworkingPlan";
import Media from "./components/media/Media";
import Country from "./components/country/Country";
import State from "./components/state/State";
import City from "./components/city/City";
import Microlocation from "./components/microlocation/Microlocation";
import Amenities from "./components/amenities/Amenities";
import Login from "./components/login-page/Login";
import React, { useEffect, useState } from "react";
import { GpState } from "./context/context";
import AddWorkSpace from "./components/coworking-space/AddWorkSpace";
import CoworkingSpace from "./components/coworking-space/CoworkingSpace";
import Brands from "./components/brands/Brands";
import Seo from "./components/SEO/Seo";
import AddSeoForm from "./components/SEO/AddSeoForm";
import EditSeo from "./components/SEO/EditSeo";
import Addbrand from "./components/brands/Addbrand";
import EditBrand from "./components/brands/EditBrand";
import EditWorkSpace from "./components/coworking-space/EditWorkSpace";
import ImageUpload from "./ImageUpload";
import OurClient from "./components/ourClients/OurClient";
import TopPrioritySpace from "./components/prioritySpace/TopPrioritySpace";
import EditMicrolocation from "./components/microlocation/EditMicrolocation";
import PriorityMicrolocation from "./components/priorityMicrolocation/PriorityMicrolocation";
import PopularSpace from "./components/popularSpaces/PopularSpace";
function App() {
  const { isLogin } = GpState();
  return (
    <div style={{ overflowX: "hidden" }}>
      <div className="row admin_main">
        <div className={isLogin ? "col-md-3" : "d-none"}>
          <Sidebar />
        </div>
        <div className={isLogin ? "col-md-9" : "col-md-12"}>
          <div>
            <Routes>
              <Route
                path="/listing-space"
                element={isLogin ? <ListingSpace /> : <Navigate to="/" />}
              />
              <Route
                path="/coworking-space"
                element={isLogin ? <CoworkingSpace /> : <Navigate to="/" />}
              />
              <Route
                path="/coworking-plan"
                element={isLogin ? <CoworkingPlan /> : <Navigate to="/" />}
              />
              <Route
                path="/media"
                element={isLogin ? <Media /> : <Navigate to="/" />}
              />
              <Route
                path="/"
                element={
                  !isLogin ? <Login /> : <Navigate to="/coworking-space" />
                }
              />
              <Route
                path="/country"
                element={isLogin ? <Country /> : <Navigate to="/" />}
              />
              <Route
                path="/state"
                element={isLogin ? <State /> : <Navigate to="/" />}
              />
              <Route
                path="/city"
                element={isLogin ? <City /> : <Navigate to="/" />}
              />
              <Route
                path="/microlocation"
                element={isLogin ? <Microlocation /> : <Navigate to="/" />}
              />
              <Route
                path="/amenities"
                element={isLogin ? <Amenities /> : <Navigate to="/" />}
              />
              <Route
                path="/seo"
                element={isLogin ? <Seo /> : <Navigate to="/" />}
              />
              <Route
                path="/coworking-space/add-coworking-space"
                element={isLogin ? <AddWorkSpace /> : <Navigate to="/" />}
              />
              <Route
                path="/seo/add-seo"
                element={isLogin ? <AddSeoForm /> : <Navigate to="/" />}
              />
              <Route
                path="/brands"
                element={isLogin ? <Brands /> : <Navigate to="/" />}
              />
              <Route
                path="/seo/editseo/:id"
                element={isLogin ? <EditSeo /> : <Navigate to="/" />}
              />
              <Route
                path="/brands/add-brand"
                element={isLogin ? <Addbrand /> : <Navigate to="/" />}
              />
              <Route
                path="/brands/edit-brand/:id"
                element={isLogin ? <EditBrand /> : <Navigate to="/" />}
              />
              <Route
                path="/coworking-space/edit-workspace/:id"
                element={isLogin ? <EditWorkSpace /> : <Navigate to="/" />}
              />
              <Route
                path="/image"
                element={isLogin ? <ImageUpload /> : <Navigate to="/" />}
              />
              <Route
                path="/clients"
                element={isLogin ? <OurClient /> : <Navigate to="/" />}
              />
              <Route
                path="/priority"
                element={isLogin ? <TopPrioritySpace /> : <Navigate to="/" />}
              />
              <Route
                path="/priority-microlocation"
                element={
                  isLogin ? <PriorityMicrolocation /> : <Navigate to="/" />
                }
              />
              <Route
                path="/popular-spaces"
                element={isLogin ? <PopularSpace /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
