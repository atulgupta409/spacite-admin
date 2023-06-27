import React, { useState, useEffect, Fragment } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import {
  getAmenities,
  getBrandsData,
  getCategory,
  getCityByState,
  getCountry,
  getMicrolocationByCity,
  getStateByCountry,
} from "./WorkSpaceService";
import { uploadFile } from "../../services/Services";
import { FaUpload } from "react-icons/fa";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
function AddWorkSpace() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const toast = useToast();
  const [updateTable, setUpdateTable] = useState(false);
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [formData, setFormData] = useState({
    montofriFrom: "09:00 AM",
    montofriTo: "07:00 PM",
    satFrom: "09:00 AM",
    satTo: "07:00 PM",
    sunFrom: "09:00 AM",
    sunTo: "07:00 PM",
  });

  const navigate = useNavigate();

  const [checkedAmenities, setCheckedAmenities] = useState([]);

  const [microlocationId, setMicrolocationId] = useState(null);
  const [fileName, setFileName] = useState([]);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [coSpace, setCoSpace] = useState({
    brand: "",
    name: "",
    slug: "",
    title: "",
    description: "",
    url: "",
    keywords: "",
    robots: "",
    twitterTitle: "",
    twitterDescription: "",
    graphTitle: "",
    graphDescription: "",
    address: "",
    country: "",
    state: "",
    city: "",
    microLocation: "",
    longitude: "",
    lattitude: "",
    postalCode: "",
    amenity: "",
    images: [],
    seats: "",
  });

  const [open, setOpen] = useState({
    isOpen: true,
    isOpenSat: true,
    isOpenSun: false,
  });
  const options = [];

  const startTime = new Date();
  startTime.setHours(9, 0, 0);

  const endTime = new Date();
  endTime.setHours(24, 0, 0);

  while (startTime < endTime) {
    const timeString = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const option = { id: options.length + 1, name: timeString };
    options.push(option);

    startTime.setMinutes(startTime.getMinutes() + 30);
  }

  useEffect(() => {
    defautcreatePlans();
  }, [categories]);

  const defautcreatePlans = () => {
    const defaultRowCount = 4;
    const time = ["Year", "Month", "Month", "Month"];
    const newRows = [];
    for (let i = 0; i < defaultRowCount; i++) {
      const newRow = {
        id: i + 1,
        category: categories.length >= i + 1 ? categories[i]._id : "",
        price: "",
        duration: time.length >= i + 1 ? time[i] : "",
      };
      newRows.push(newRow);
    }

    setPlans(newRows);
  };

  const createPlans = () => {
    const newRow = {
      id: plans.length + 1,
      category: "",
      price: "",
      duration: "",
    };

    setPlans((prevRows) => [...prevRows, newRow]);
  };

  const removePlan = (id) => {
    setPlans((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // useEffect(() => {
  //   defautcreateContacts();
  // }, [coSpace]);

  // const defautcreateContacts = () => {
  //   const defaultRowCount = 1;
  //   const newRows = [];
  //   for (let i = 0; i < defaultRowCount; i++) {
  //     const newRow = {
  //       id: i + 1,
  //       user: "",
  //       email: "",
  //       phone: "",
  //       designation: "",
  //     };
  //     newRows.push(newRow);
  //   }

  //   setContacts(newRows);
  // };
  const createContact = () => {
    const newRow = {
      id: contacts.length + 1,
      user: "",
      email: "",
      phone: "",
      designation: "",
    };

    setContacts((prevRows) => [...prevRows, newRow]);
  };

  const removeContact = (id) => {
    setContacts((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  const onChangePlanHandler = (e, id) => {
    const { name, value } = e.target;
    setPlans((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const onChangePlanHandler2 = (e, id) => {
    const { value } = e.target;
    setPlans((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, duration: value } : row))
    );
  };

  const handleInputPlanChange = (e, id) => {
    const { name, value } = e.target;
    setPlans((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          return { ...row, [name]: value };
        }
        return row;
      })
    );
  };

  const handleInputContactChange = (e, id) => {
    const { name, value } = e.target;
    setContacts((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          return { ...row, [name]: value };
        }
        return row;
      })
    );
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  let footer_descript_value = convertToRaw(editorState.getCurrentContent())
    .blocks[0].text;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoSpace({
      ...coSpace,
      [name]: value,
    });
  };
  const handleFetchCity = async () => {
    await getCityByState(stateId, setCities);
  };
  const handleFetchStates = async () => {
    await getStateByCountry(countryId, setStates);
  };
  const handleFetchMicrolocation = async () => {
    await getMicrolocationByCity(cityId, setMicrolocations);
  };

  const handleFetchCountry = async () => {
    await getCountry(setCountry);
  };

  const handleFetchBrands = async () => {
    await getBrandsData(setBrands);
  };
  const handleFetchAmenity = async () => {
    await getAmenities(setAmenities);
  };
  const handleFetchCategory = async () => {
    await getCategory(setCategories);
  };
  const onChangeHandler = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option = el.getAttribute("id");
    const { name, value } = e.target;

    let updatedCoSpace = {
      ...coSpace,
      [name]: value,
    };

    if (name === "country") {
      setCountryId(option);
    } else if (name === "state") {
      setStateId(option);
      setCoSpace({
        ...updatedCoSpace,
      });
    } else if (name === "city") {
      setCityId(option);
      setCoSpace({
        ...updatedCoSpace,
      });
    } else if (name === "microLocation") {
      setMicrolocationId(option);
      setCoSpace({
        ...updatedCoSpace,
      });
    } else if (name === "brand") {
      setBrandId(option);
      setCoSpace({
        ...updatedCoSpace,
      });
    }

    setCoSpace(updatedCoSpace);
  };

  const previewFile = (data) => {
    setImages((prevImages) => [...prevImages, ...data]);
  };
  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };
  const handleSaveWorkSpace = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/workSpace/workSpaces`,
        {
          name: coSpace.name,
          description: footer_descript_value,
          images: imageData,
          amenties: checkedAmenities,
          seo: {
            title: coSpace.title,
            description: coSpace.description,
            robots: indexed,
            index: isChecked,
            keywords: coSpace.keywords,
            url: coSpace.url,
            status: false,
            twitter: {
              title: coSpace.twitterTitle,
              description: coSpace.twitterDescription,
            },
            open_graph: {
              title: coSpace.graphTitle,
              description: coSpace.graphDescription,
            },
          },
          location: {
            address: coSpace.address,
            country: countryId,
            state: stateId,
            city: cityId,
            micro_location: microlocationId,
            latitude: coSpace.lattitude,
            longitude: coSpace.longitude,
          },
          // no_of_seats: coSpace.seats,
          hours_of_operation: {
            monday_friday: {
              from: formData.montofriFrom,
              to: formData.montofriTo,
              is_open_24: open.isOpen,
            },
            saturday: {
              from: formData.satFrom,
              to: formData.satTo,
              is_open_24: open.isOpenSat,
            },
            sunday: {
              from: formData.sunFrom,
              to: formData.sunTo,
              is_open_24: open.isOpenSun,
            },
          },
          plans,
          contact_details: contacts,
          // status,
          brand: brandId,
          slug: coSpace.slug,
        }
      );
      setCoSpace({
        brand: "",
        name: "",
        slug: "",
        title: "",
        description: "",
        url: "",
        keywords: "",
        robots: "",
        twitterTitle: "",
        twitterDescription: "",
        graphTitle: "",
        graphDescription: "",
        address: "",
        country: "",
        state: "",
        city: "",
        microLocation: "",
        longitude: "",
        lattitude: "",
        postalCode: "",
        amenity: "",
        images: [],
        seats: "",
      });
      setUpdateTable((prev) => !prev);
      navigate("/coworking-space");
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
        description: "Failed to Saved the Space",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const checkedAmenityIds = [
    "649ac39ceab467c22dbe8ced",
    "649ac3bfeab467c22dbe8cf1",
    "649ac3ceeab467c22dbe8cf5",
    "649ac3e0eab467c22dbe8cf9",
    "649ac3f3eab467c22dbe8cfd",
    "649ac403eab467c22dbe8d01",
    "649ac415eab467c22dbe8d05",
    "649ac425eab467c22dbe8d09",
    "649ac434eab467c22dbe8d0d",
    "649ac449eab467c22dbe8d11",
  ];
  useEffect(() => {
    setCheckedAmenities(checkedAmenityIds);
  }, [amenities]);
  const handleCheckboxChange = (event) => {
    const checkedAmenityId = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setCheckedAmenities((prevCheckedAmenities) => [
        ...prevCheckedAmenities,
        checkedAmenityId,
      ]);
    } else {
      setCheckedAmenities((prevCheckedAmenities) =>
        prevCheckedAmenities.filter((id) => id !== checkedAmenityId)
      );
    }
  };
  const handleSelect = (selectedOption, field) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: selectedOption.value,
    }));
  };
  const removePreviewImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  const handleInputByClick = (e) => {
    const files = Array.from(e.target.files);
    handleUploadFile(files);
    const fileNames = files.map((file) => file.name);
    setFileName(fileNames);
  };
  useEffect(() => {
    handleFetchCountry();
    handleFetchBrands();
    handleFetchAmenity();
    handleFetchCategory();
  }, []);
  const [imageData, setImageData] = useState([]);
  useEffect(() => {
    const combinedArray = images.map((image, index) => ({
      image,
      name: fileName[index],
      alt: fileName[index],
    }));
    setImageData([...combinedArray]);
  }, [images, fileName]);
  const handleAltChange = (event, index) => {
    const updatedArray = [...imageData]; // Create a copy of the mergedArray
    updatedArray[index].alt = event.target.value; // Update the alt value at the specified index

    setImageData(updatedArray);
  };
  const toggleHoursHandler = (event, day) => {
    const isChecked = event.target.checked;
    setOpen((prevState) => ({
      ...prevState,
      [day]: isChecked,
    }));
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
        <form style={{ textAlign: "left" }} onSubmit={handleSaveWorkSpace}>
          <div className="container">
            <div className="row pt-4">
              <div className="col-md-3 d-flex justify-content-between align-items-center">
                <h4 className="property_form_h4">Contact Details</h4>
                <IoIosAddCircle
                  onClick={createContact}
                  className="icon"
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="mb-5">
              {contacts?.map((row, id) => (
                <div className="row pt-3" key={row.id}>
                  <div className="col-md-3">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputUser"
                        placeholder="User*"
                        name="user"
                        value={row.user}
                        onChange={(e) => handleInputContactChange(e, row.id)}
                      />
                      <label htmlFor="floatingInputUser">Name</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputEmail"
                        placeholder="Email*"
                        name="email"
                        value={row.email}
                        onChange={(e) => handleInputContactChange(e, row.id)}
                      />
                      <label htmlFor="floatingInputEmail">Email</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputPhone"
                        placeholder="Phone"
                        name="phone"
                        value={row.phone}
                        onChange={(e) => handleInputContactChange(e, row.id)}
                      />
                      <label htmlFor="floatingInputPhone">Phone</label>
                    </div>
                  </div>
                  <div className="col-md-3 d-flex justify-content-between align-items-center">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputDesignation"
                        placeholder="Designation"
                        name="designation"
                        value={row.designation}
                        onChange={(e) => handleInputContactChange(e, row.id)}
                      />
                      <label htmlFor="floatingInputDesignation">
                        Designation
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <AiFillDelete
                        className="icon"
                        style={{ cursor: "pointer", marginTop: "14px" }}
                        onClick={() => removeContact(row.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row pt-3">
              <div className="col-md-12">
                <h4>Coworking Details</h4>
              </div>
              <div className="col-md-4">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Name*"
                    name="name"
                    value={coSpace.name}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInput">Name</label>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputSlug"
                    placeholder="Slug*"
                    name="slug"
                    value={coSpace.slug}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInputSlug">Slug</label>
                </div>
              </div>
              <div className="col-md-4 mb-5">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0 5px",
                  }}
                >
                  <select
                    className="form-select property-input"
                    name="brand"
                    aria-label="Default select example"
                    value={coSpace.brand}
                    onChange={onChangeHandler}
                    required
                  >
                    <option>Select a brand</option>
                    <option value="Others">Others</option>
                    {brands?.map((brand) => (
                      <option id={brand._id} key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <h4 className="property_form_h4">Location</h4>
              <div className="col-md-6">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInputAddress"
                    placeholder="Address*"
                    name="address"
                    value={coSpace.address}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInputAddress">Address*</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={coSpace.country}
                    onChange={onChangeHandler}
                    name="country"
                    onClick={handleFetchStates}
                    required
                  >
                    <option>Select a country*</option>
                    {country?.map((countryElem) => (
                      <option
                        id={countryElem._id}
                        key={countryElem._id}
                        value={countryElem.name}
                      >
                        {countryElem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={coSpace.state}
                    name="state"
                    onChange={onChangeHandler}
                    onClick={handleFetchCity}
                    required
                  >
                    <option>Select a state*</option>
                    {states?.map((stateElem) => (
                      <option
                        id={stateElem._id}
                        key={stateElem._id}
                        value={stateElem.name}
                      >
                        {stateElem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={coSpace.city}
                    onChange={onChangeHandler}
                    onClick={handleFetchMicrolocation}
                    name="city"
                    required
                  >
                    <option>Select a city*</option>
                    {cities?.map((cityElem) => (
                      <option
                        id={cityElem._id}
                        key={cityElem._id}
                        value={cityElem.name}
                      >
                        {cityElem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="microLocation"
                    value={coSpace.microLocation}
                    onChange={onChangeHandler}
                    required
                  >
                    <option>Select a microlocation*</option>
                    {microlocations?.map((microLocation) => (
                      <option
                        id={microLocation._id}
                        key={microLocation._id}
                        value={microLocation.name}
                      >
                        {microLocation.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-md-3">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputLatti"
                    placeholder="Lattitude"
                    name="lattitude"
                    value={coSpace.lattitude}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInputLatti">Lattitude</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputLongi"
                    placeholder="Longitude"
                    name="longitude"
                    value={coSpace.longitude}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInputLongi">Longitude</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputPostal"
                    placeholder="Postal Code"
                    name="postalCode"
                    value={coSpace.postalCode}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputPostal">Postal Code</label>
                </div>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-md-12">
                <h4 className="property_form_h4">About Property</h4>
              </div>
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

            <div className="row mb-5">
              <h4 className="property_form_h4">Amenities</h4>
              <div className="form-check" style={{ marginLeft: "9px" }}>
                {amenities?.map((amenity) => (
                  <div key={amenity._id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={amenity._id}
                      id="flexCheckDefault"
                      name="amenity"
                      onChange={handleCheckboxChange}
                      checked={checkedAmenities.includes(amenity._id)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="row mb-5">
              <h4 className="property_form_h4">Images</h4>
              <div className="container">
                <label className="file">
                  <input
                    type="file"
                    id="file-input"
                    multiple
                    aria-label="File browser example"
                    onChange={handleInputByClick}
                  />
                </label>

                {progress ? (
                  <div>
                    <p className="mx-auto">
                      <strong>Uploading Progress</strong>
                    </p>
                    <div className="progress mx-auto">
                      <div
                        id="progress-bar"
                        className="progress-bar progress-bar-striped bg-info"
                        role="progressbar"
                        aria-valuenow="40"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: `${progress}%` }}
                      >
                        {progress}%
                      </div>
                    </div>
                  </div>
                ) : isUploaded ? (
                  <h5>Uploaded</h5>
                ) : (
                  ""
                )}
                <div id="preview" className="mt-3 d-flex align-items-center">
                  <div
                    className="table-box"
                    style={{
                      width: "100%",
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  >
                    <h3>Images</h3>
                    <TableContainer variant="striped" color="teal">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Order No.</Th>
                            <Th>Image</Th>
                            <Th>Name</Th>
                            <Th>Alt</Th>

                            <Th>Delete</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {imageData?.map((img, index) => (
                            <Fragment key={index}>
                              <Tr>
                                <Td>{index + 1}</Td>
                                <Td>
                                  <img
                                    src={img.image}
                                    alt="media"
                                    width="80px"
                                  />
                                </Td>
                                <Td>{img.name}</Td>
                                <Td>
                                  <input
                                    type="text"
                                    style={{ color: "#000" }}
                                    value={img.alt}
                                    onChange={(event) =>
                                      handleAltChange(event, index)
                                    }
                                  />
                                </Td>

                                <Td>
                                  <AiFillDelete
                                    onClick={() => removePreviewImage(index)}
                                    className="icon"
                                    style={{ color: "red" }}
                                  />
                                </Td>
                              </Tr>
                            </Fragment>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row mb-5">
              <div className="col-md-3">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputSeats"
                    placeholder="No. Of Seats"
                    name="seats"
                    value={coSpace.seats}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputSeats">No. Of Seats</label>
                </div>
              </div>
            </div> */}
            <div className="row">
              <h4 className="property_form_h4">Hours Of Operation</h4>
              <div className="col-md-3">Monday-Friday</div>
              <div className="col-md-2" style={{ paddingTop: "8px" }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="mon-fri-close"
                    id="flexCheckDefault"
                    onChange={(event) => toggleHoursHandler(event, "isOpen")}
                    checked={open.isOpen}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Open
                  </label>
                </div>
              </div>
              {open.isOpen && (
                <>
                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={formData.montofriFrom}
                        onChange={(e) => handleSelect(e.target, "montofriFrom")}
                      >
                        <option value="">From*</option>
                        {options.map((option, i) => (
                          <option key={i} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={formData.montofriTo}
                        onChange={(e) => handleSelect(e.target, "montofriTo")}
                        name="hours_of_operation.monday_friday.to"
                      >
                        <option value="">To*</option>
                        {options.map((option, i) => (
                          <option key={i} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="row">
              <div className="col-md-3">Saturday</div>
              <div className="col-md-2" style={{ paddingTop: "8px" }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="sat"
                    id="flexCheckDefault"
                    onChange={(event) => toggleHoursHandler(event, "isOpenSat")}
                    checked={open.isOpenSat}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Open
                  </label>
                </div>
              </div>
              {open.isOpenSat && (
                <>
                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={formData.satFrom}
                        onChange={(e) => handleSelect(e.target, "satFrom")}
                      >
                        <option value="">From*</option>
                        {options.map((option, i) => (
                          <option key={i} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={formData.satTo}
                        onChange={(e) => handleSelect(e.target, "satTo")}
                      >
                        <option value="">To*</option>
                        {options.map((option, i) => (
                          <option key={i} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="row mb-5">
              <div className="col-md-3">Sunday</div>
              <div className="col-md-2" style={{ paddingTop: "8px" }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="sun"
                    id="flexCheckDefault"
                    onChange={(event) => toggleHoursHandler(event, "isOpenSun")}
                    checked={open.isOpenSun}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Open
                  </label>
                </div>
              </div>
              {open.isOpenSun && (
                <>
                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={formData.sunFrom}
                        onChange={(e) => handleSelect(e.target, "sunFrom")}
                      >
                        <option value="">From*</option>
                        {options.map((option, i) => (
                          <option key={i} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={formData.sunTo}
                        onChange={(e) => handleSelect(e.target, "sunTo")}
                      >
                        <option value="">To*</option>
                        {options.map((option, i) => (
                          <option key={i} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex w-50 justify-content-between align-items-center">
              <h4 className="property_form_h4">Plans</h4>
              <IoIosAddCircle
                onClick={createPlans}
                className="icon"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="mb-5">
              {plans.map((row, id) => (
                <div className="row" key={row.id}>
                  <div className="col-md-3">
                    <div
                      style={{
                        borderBottom: "1px solid #cccccc",
                        margin: "20px 0",
                      }}
                    >
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        name="category"
                        value={row.category}
                        onChange={(e) => onChangePlanHandler(e, row.id)}
                        required
                      >
                        <option>Select Category*</option>
                        {categories?.map((category) => (
                          <option
                            id={category._id}
                            key={category._id}
                            value={category._id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      style={{
                        borderBottom: "1px solid #cccccc",
                        margin: "20px 0",
                      }}
                    >
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) => onChangePlanHandler2(e, row.id)}
                        value={row.duration}
                      >
                        <option>Duration</option>
                        <option value="Month">Month</option>
                        <option value="Day">Day</option>
                        <option value="Year">Year</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputPrice"
                        placeholder="Price*"
                        name="price"
                        value={row.price}
                        onChange={(e) => handleInputPlanChange(e, row.id)}
                        required
                      />
                      <label htmlFor="floatingInputPrice">Price*</label>
                    </div>
                  </div>
                  <div className="col-md-3 d-flex align-items-center">
                    <AiFillDelete
                      className="icon"
                      style={{ cursor: "pointer" }}
                      onClick={() => removePlan(row.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="row my-2">
              <h4 className="property_form_h4">SEO Details</h4>
              <div className="col-md-6">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputTitle"
                    placeholder="Title"
                    name="title"
                    value={coSpace.title}
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
                    id="floatingInputKeywords"
                    placeholder="Keywords"
                    name="keywords"
                    value={coSpace.keywords}
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
                    id="floatingInputDescription"
                    placeholder="Description"
                    name="description"
                    value={coSpace.description}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputDescription">Description</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputTwitter"
                    placeholder="Twitter Title"
                    name="twitterTitle"
                    value={coSpace.twitterTitle}
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
                    placeholder="Twitter Description"
                    name="twitterDescription"
                    value={coSpace.twitterDescription}
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
                    value={coSpace.graphTitle}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInputOgTitle">Open Graph Title</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInputOgDesc"
                    placeholder="Open Graph Description"
                    name="graphDescription"
                    value={coSpace.graphDescription}
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

export default AddWorkSpace;
