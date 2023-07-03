import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-dropdown-select";
import ImageUpload from "../../ImageUpload";
import BASE_URL from "../../apiConfig";
import { uploadFile } from "../../services/Services";

function Addbrand() {
  const toast = useToast();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState({
    name: "",
    order: "",
    cities: "",
    title: "",
    descriptionSeo: "",
    path: "",
    keywords: "",
    robots: "",
    twitterTitle: "",
    twitterDescription: "",
    graphTitle: "",
    graphDescription: "",
    script: "",
    footerTitle: "",
  });

  const [updateTable, setUpdateTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isUploaded, setIsUploaded] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrand({
      ...brand,
      [name]: value,
    });
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BASE_URL}/api/brand/brands`, {
        name: brand.name,
        order: brand.order,
        image: images[0],
        seo: {
          title: brand.title,
          description: brand.descriptionSeo,
          footer_title: brand.footerTitle,
          footer_description: footer_descript_value,
          robots: indexed,
          index: isChecked,
          keywords: brand.keywords,
          url: brand.path,
          twitter: {
            title: brand.twitterTitle,
            description: brand.twitterDescription,
          },
          open_graph: {
            title: brand.graphTitle,
            description: brand.graphDescription,
          },
        },
        cities: selectedOptions,
      });
      setBrand({
        name: "",
        order: "",
        cities: "",
        title: "",
        descriptionSeo: "",
        path: "",
        keywords: "",
        robots: "",
        twitterTitle: "",
        twitterDescription: "",
        graphTitle: "",
        graphDescription: "",
        script: "",
        footerTitle: "",
      });
      setUpdateTable((prev) => !prev);
      navigate("/brands");
      toast({
        title: "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const getCity = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/city/cities`);
      setLoading(false);
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCity();
  }, [updateTable]);
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  let footer_descript_value = convertToRaw(editorState.getCurrentContent())
    .blocks[0].text;

  const handleDropdownChange = (selectedValues) => {
    const ids = selectedValues.map((option) => option._id);
    setSelectedOptions(ids);
  };

  const previewFile = (data) => {
    const allimages = images;
    setImages(allimages.concat(data));
  };

  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };

  const [indexed, setIndexed] = useState("noindex, nofollow");
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange2 = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    setIndexed(checked ? "index, follow" : "noindex, nofollow");
  };
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form style={{ textAlign: "left" }} onSubmit={handleSaveBrand}>
          <div className="container">
            <div className="row pt-4">
              <h4 className="property_form_h4">Brand Details</h4>
              <div className="col-md-6">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Name*"
                    name="name"
                    value={brand.name}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInput">Name*</label>
                </div>
              </div>

              <div className="col-md-6 d-flex justify-content-evenly align-items-end">
                <h5 style={{ marginTop: "25px" }}>Logo Upload</h5>
                <ImageUpload
                  images={images}
                  setImages={setImages}
                  progress={progress}
                  setProgress={setProgress}
                  uploadFile={handleUploadFile}
                  isUploaded={isUploaded}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                  }}
                >
                  <Select
                    options={cities}
                    multi
                    onChange={handleDropdownChange}
                    values={selectedOptions}
                    labelField="name"
                    valueField="_id"
                    placeholder="Select Cities"
                  />
                </div>
              </div>
            </div>
            <div className="row my-2">
              <h4 className="property_form_h4">SEO Details</h4>
              <div className="col-md-6">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Title"
                    name="title"
                    value={brand.title}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInput">Title</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Keywords"
                    name="keywords"
                    value={brand.keywords}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInput">Keywords</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Description"
                    name="descriptionSeo"
                    value={brand.descriptionSeo}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInput">Description</label>
                </div>
              </div>
            </div>

            <div className="row my-2">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputTwitter"
                    placeholder="Twitter title"
                    name="twitterTitle"
                    value={brand.twitterTitle}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputTwitter">Twitter Title</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInputTwitDesc"
                    name="twitterDescription"
                    placeholder="Twitter Description"
                    value={brand.twitterDescription}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputTwitDesc">
                    Twitter Description
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputOgTitle"
                    placeholder="Open Graph Title"
                    name="graphTitle"
                    value={brand.graphTitle}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputOgTitle">Open Graph Title</label>
                </div>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInputOgDesc"
                    placeholder="Open Graph Description"
                    name="graphDescription"
                    value={brand.graphDescription}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputOgDesc">
                    Open Graph Description
                  </label>
                </div>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    checked={isChecked}
                    onChange={handleCheckboxChange2}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Discourage search engines from indexing this Page
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <h4 className="property_form_h4">Footer Details</h4>
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputTwitter"
                    placeholder="Footer Title"
                    value={brand.footerTitle}
                    name="footerTitle"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputTwitter">Footer Title</label>
                </div>
              </div>
            </div>
            <h6 className="mt-4">Footer description</h6>
            <div className="row">
              <div className="col-md-12">
                <Editor
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={(editorState) =>
                    onEditorStateChange(editorState)
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button type="submit" className="saveproperty-btn">
              Save
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Addbrand;
