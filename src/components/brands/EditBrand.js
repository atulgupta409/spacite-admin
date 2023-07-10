import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import Select from "react-dropdown-select";
import ImageUpload from "../../ImageUpload";
import { getBrandsDataById, getCity } from "./BrandService";
import Loader from "../loader/Loader";
import draftToHtml from "draftjs-to-html";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import BASE_URL from "../../apiConfig";
import { uploadFile } from "../../services/Services";
import { htmlToText } from "html-to-text";

const initialValue = {
  name: "",
  description: "",
  order: "",
  image: "",
  seo: {
    title: "",
    description: "",
    footer_title: "",
    footer_description: "",
    robots: "",
    keywords: "",
    url: "",
    twitter: {
      title: "",
      description: "",
    },
    open_graph: {
      title: "",
      description: "",
    },
  },
  cities: [],
};

const EditBrand = () => {
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [brands, setBrands] = useState(initialValue);
  const {
    name,
    description,
    order,
    image,
    featureImage,
    seo,
    cities,
    type,
    slug,
    should_show_on_home,
  } = brands;
  const [updateTable, setUpdateTable] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploadedFeature, setIsUploadedFeature] = useState(false);
  const [progressFeature, setProgressFeature] = useState(0);
  const [featureImages, setfeatureImages] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleInputChange = (e) => {
    console.log(e.target.value);
    setBrands({ ...brands, [e.target.name]: e.target.value });
  };
  const handleInputChangeObject = (event, section, property) => {
    const { value } = event.target;
    const updatedState = {
      ...brands,
      [section]: {
        ...brands[section],
        [property]: value,
      },
    };
    setBrands(updatedState);
  };
  const handleInputChange2 = (event) => {
    const { name, value } = event.target;
    const [category, subCategory, property] = name.split(".");

    setBrands((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [subCategory]: {
          ...prevState[category][subCategory],
          [property]: value,
        },
      },
    }));
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const footer_descrip = draftToHtml(
    convertToRaw(editorState.getCurrentContent())
  );

  const handleEditBrands = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${BASE_URL}/api/brand/brands/${id}`, {
        name,
        description,
        order,
        image: images[0],
        featureImage: featureImages[0],
        seo: {
          title: seo?.title,
          description: seo?.description,
          footer_title: seo?.footer_title,
          footer_description: footer_descrip,
          robots: indexed,
          index: isChecked,
          keywords: seo?.keywords,
          url: seo?.url,
          twitter: {
            title: seo?.twitter?.title,
            description: seo?.twitter?.description,
          },
          open_graph: {
            title: seo?.open_graph?.title,
            description: seo?.open_graph?.description,
          },
        },
        cities: selectedOptions,
        type,
        slug,
        should_show_on_home,
      });
      setBrands(data);
      setUpdateTable((prev) => !prev);
      navigate("/brands");
      toast({
        title: "Update Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchBrandsById = async () => {
    await getBrandsDataById(
      setLoading,
      setIsChecked,
      setIndexed,
      setBrands,
      id
    );
  };
  useEffect(() => {
    const selectCities = cities.map((city) => city._id);
    setSelectedOptions(selectCities);
  }, [cities]);
  const handleFetchCity = async () => {
    await getCity(setAllCity);
  };

  useEffect(() => {
    const contentState = ContentState.createFromText(
      htmlToText(seo?.footer_description) || "empty"
    );
    const initialEditorState = EditorState.createWithContent(contentState);
    setEditorState(initialEditorState);
  }, [brands]);

  useEffect(() => {
    handleFetchCity();
    handleFetchBrandsById();
  }, [updateTable]);
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
  const previewfeatureImages = (data) => {
    const allimages = featureImages;
    setfeatureImages(allimages.concat(data));
  };
  const handleUploadfeatureImages = async (files) => {
    await uploadFile(
      files,
      setProgressFeature,
      setIsUploadedFeature,
      previewfeatureImages
    );
  };
  const [indexed, setIndexed] = useState("noindex, nofollow");
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange2 = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    setIndexed(checked ? "index, follow" : "noindex, nofollow");
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form style={{ textAlign: "left" }} onSubmit={handleEditBrands}>
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
                    value={name}
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
                <img src={image} width="25%" alt="image" />
              </div>
            </div>
            <div className="row pt-4">
              <div className="col-md-6">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                  }}
                >
                  <Select
                    options={allCity}
                    multi
                    onChange={handleDropdownChange}
                    values={cities}
                    labelField="name"
                    valueField="_id"
                    placeholder="Select Cities"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <h4 className="property_form_h4">Upload Feature Image</h4>
              <ImageUpload
                images={featureImages}
                setImages={setfeatureImages}
                progress={progressFeature}
                setProgress={setProgressFeature}
                uploadFile={handleUploadfeatureImages}
                isUploaded={isUploadedFeature}
              />
              <img
                src={featureImage}
                style={{ width: "25%", marginTop: "30px" }}
                alt="image"
              />
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <h4 className="property_form_h4">SEO Details</h4>
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Title"
                    name="seo"
                    value={seo?.title}
                    onChange={(event) =>
                      handleInputChangeObject(event, "seo", "title")
                    }
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
                    name="seo"
                    value={seo?.keywords}
                    onChange={(event) =>
                      handleInputChangeObject(event, "seo", "keywords")
                    }
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
                    name="seo"
                    value={seo?.description}
                    onChange={(event) =>
                      handleInputChangeObject(event, "seo", "description")
                    }
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
                    name="seo.twitter.title"
                    value={seo?.twitter?.title}
                    onChange={handleInputChange2}
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
                    name="seo.twitter.description"
                    placeholder="Twitter Description"
                    value={seo?.twitter?.description}
                    onChange={handleInputChange2}
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
                    placeholder="Open graph title"
                    name="seo.open_graph.title"
                    value={seo?.open_graph?.title}
                    onChange={handleInputChange2}
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
                    name="seo.open_graph.description"
                    value={seo?.open_graph?.description}
                    onChange={handleInputChange2}
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
                    value={seo?.footer_title}
                    name="seo"
                    onChange={(event) =>
                      handleInputChangeObject(event, "seo", "footer_title")
                    }
                  />
                  <label htmlFor="floatingInputTwitter">Footer Title</label>
                </div>
              </div>
            </div>
            <h6 className="mt-4">Footer description</h6>
            <div className="row">
              <div className="col-md-12">
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
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
};

export default EditBrand;
