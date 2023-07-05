import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { IoIosAddCircle } from "react-icons/io";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { AiFillDelete } from "react-icons/ai";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import Loader from "../loader/Loader";
import {
  getCityByState,
  getStateByCountry,
  getCountry,
  getMicrolocationByCity,
  getAmenities,
  getBrandsData,
  getCategory,
} from "./WorkSpaceService";
import { uploadFile } from "../../services/Services";
import BASE_URL from "../../apiConfig";
import draftToHtml from "draftjs-to-html";
import Select from "react-select";
const initialValue = {
  name: "",
  description: "",
  images: [],
  amenties: "",
  seo: {
    title: "",
    description: "",
    robots: "",
    keywords: "",
    url: "",
    status: false,
    twitter: {
      title: "",
      description: "",
    },
    open_graph: {
      title: "",
      description: "",
    },
  },
  location: {
    address: "",
    country: "",
    state: "",
    city: "",
    micro_location: "",
    latitude: "",
    longitude: "",
  },
  no_of_seats: "",
  hours_of_operation: {
    monday_friday: {
      from: "",
      to: "",
    },
    saturday: {
      from: "",
      to: "",
    },
    sunday: {
      from: "",
      to: "",
    },
  },
  plans: [
    {
      category: "",
      price: "",
      duration: "",
    },
  ],
  contact_details: [
    {
      user: "",
      email: "",
      phone: "",
      designation: "",
    },
  ],
  brand: {},
  slug: "",
};

const EditWorkSpace = () => {
  const [loading, setLoading] = useState(false);
  const [allplans, setAllPlans] = useState([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [updateTable, setUpdateTable] = useState(false);
  const [allimage, setAllImage] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [workSpaces, setWorkSpaces] = useState(initialValue);
  const [fileName, setFileName] = useState([]);
  const [allContact, setAllContact] = useState([]);
  const {
    name,
    description,
    no_of_seats,
    website_Url,
    images,
    amenties,
    location,
    hours_of_operation,
    plans,
    contact_details,
    slug,
    seo,
    brand,
    is_popular,
  } = workSpaces;
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
  const [checkedAmenities, setCheckedAmenities] = useState([]);
  const [apiValues, setApiValues] = useState({
    isOpen: true,
    isOpenSat: false,
    isOpenSun: false,
  });
  const [mergedArray, setMergedArray] = useState([]);
  const [selectedMicroLocation, setSelectedMicroLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const getWorkSpacesDataById = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/api/workSpace/workSpaces/${id}`
      );

      setWorkSpaces(data);
      setApiValues({
        isOpen: data.hours_of_operation.monday_friday.is_open_24,
        isOpenSat: data.hours_of_operation.saturday.is_open_24,
        isOpenSun: data.hours_of_operation.sunday.is_open_24,
      });
      setIsChecked(data.seo.index);
      setIndexed(data.seo.robots);
      handleFetchStates(data.location.country);
      handleFetchCity(data.location.state);
      handleFetchMicrolocation(data.location.city);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "country":
        setSelectedCountry(selectedOption);
        handleFetchStates(selectedOption ? selectedOption.value : null);
        break;
      case "city":
        setSelectedCity(selectedOption);
        handleFetchMicrolocation(selectedOption ? selectedOption.value : null);
        break;
      case "microLocation":
        setSelectedMicroLocation(selectedOption);
        break;
      case "state":
        setSelectedState(selectedOption);
        handleFetchCity(selectedOption ? selectedOption.value : null);
        break;

      default:
        break;
    }
  };
  const microLocationOptions = microlocations?.map((microLocation) => ({
    value: microLocation._id,
    label: microLocation.name,
  }));
  const stateOptions = states?.map((state) => ({
    value: state._id,
    label: state.name,
  }));
  const countryOptions = country?.map((item) => ({
    value: item._id,
    label: item.name,
  }));
  const cityOptions = cities?.map((city) => ({
    value: city._id,
    label: city.name,
  }));
  useEffect(() => {
    const initialCountry = countryOptions.find(
      (option) => option.value === location.country
    );
    if (initialCountry) {
      setSelectedCountry(initialCountry);
    }
  }, [states]);
  useEffect(() => {
    const initialState = stateOptions.find(
      (option) => option.value === location.state
    );
    if (initialState) {
      setSelectedState(initialState);
    }
  }, [states]);
  useEffect(() => {
    const initialCity = cityOptions.find(
      (option) => option.value === location.city
    );
    if (initialCity) {
      setSelectedCity(initialCity);
    }
  }, [cities]);
  useEffect(() => {
    const initialMicroLocation = microLocationOptions.find(
      (option) => option.value === location.micro_location
    );
    if (initialMicroLocation) {
      setSelectedMicroLocation(initialMicroLocation);
    }
  }, [microlocations]);
  const toggleHoursHandler = (event, day, allday) => {
    const isChecked = event.target.checked;
    setApiValues((prevState) => ({
      ...prevState,
      [day]: isChecked,
    }));
    if (isChecked) {
      setWorkSpaces((prevState) => ({
        ...prevState,
        hours_of_operation: {
          ...prevState.hours_of_operation,
          [allday]: { from: "", to: "" },
        },
      }));
    }
  };

  useEffect(() => {
    if (plans) {
      setAllPlans(plans);
    }
    if (contact_details) {
      setAllContact(contact_details);
    }
  }, [plans, contact_details]);
  const createPlans = () => {
    const newRow = {
      id: allplans.length + 1,
      category: "",
      price: "",
      duration: "",
    };
    setAllPlans((prevRows) => [...prevRows, newRow]);
  };
  const removePlan = (id) => {
    setAllPlans((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  const createContact = () => {
    const newRow = {
      id: allContact.length + 1,
      user: "",
      email: "",
      phone: "",
      designation: "",
    };
    setAllContact((prevRows) => [...prevRows, newRow]);
  };
  const removeContact = (id) => {
    setAllContact((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  const onChangePlanHandler = (e, id) => {
    const { name, value } = e.target;
    setAllPlans((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const onChangePlanHandler2 = (e, id) => {
    const { value } = e.target;
    setAllPlans((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, duration: value } : row))
    );
  };

  const handleInputPlanChange = (e, id) => {
    const { name, value } = e.target;
    setAllPlans((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };
  const handleInputContactChange = (e, id) => {
    const { name, value } = e.target;
    setAllContact((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const handleInputChange = (e) => {
    setWorkSpaces({ ...workSpaces, [e.target.name]: e.target.value });
  };
  const handleInputChangeObject = (event, section, property) => {
    const { value } = event.target;
    const updatedState = {
      ...workSpaces,
      [section]: {
        ...workSpaces[section],
        [property]: value,
      },
    };
    setWorkSpaces(updatedState);
  };
  const handleInputChange2 = (event) => {
    const { name, value } = event.target;
    const [category, subCategory, property] = name.split(".");

    setWorkSpaces((prevState) => ({
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
  const handleEditWorkSpace = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/workSpace/workSpaces/${id}`,
        {
          name: name,
          description: footer_descrip,
          images: mergedArray,
          amenties: checkedAmenities,
          seo: {
            title: seo.title,
            description: seo.description,
            robots: indexed,
            index: isChecked,
            keywords: seo.keywords,
            url: seo.url,
            twitter: {
              title: seo.twitter.title,
              description: seo.twitter.description,
            },
            open_graph: {
              title: seo.open_graph.title,
              description: seo.open_graph.description,
            },
          },
          location: {
            address: location.address,
            country: selectedCountry.value,
            state: selectedState.value,
            city: selectedCity.value,
            micro_location: selectedMicroLocation.value,
            latitude: location.latitude,
            longitude: location.longitude,
          },
          // no_of_seats,
          hours_of_operation: {
            monday_friday: {
              from: hours_of_operation.monday_friday.from,
              to: hours_of_operation.monday_friday.to,
              is_open_24: apiValues.isOpen,
            },
            saturday: {
              from: hours_of_operation.saturday.from,
              to: hours_of_operation.saturday.to,
              is_open_24: apiValues.isOpenSat,
            },
            sunday: {
              from: hours_of_operation.sunday.from,
              to: hours_of_operation.sunday.to,
              is_open_24: apiValues.isOpenSun,
            },
          },
          plans: allplans,
          contact_details: allContact,
          priority: {
            location: {
              city: selectedCity.value,
            },
          },
          brand,
          slug,
        }
      );
      setWorkSpaces(data);
      setUpdateTable((prev) => !prev);
      navigate("/coworking-space");
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

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const footer_descrip = draftToHtml(
    convertToRaw(editorState.getCurrentContent())
  );
  useEffect(() => {
    const contentState = ContentState.createFromText(description || "empty");
    const initialEditorState = EditorState.createWithContent(contentState);
    setEditorState(initialEditorState);
  }, [workSpaces]);

  const handleFetchCity = async (id) => {
    await getCityByState(id, setCities);
  };
  const handleFetchStates = async (id) => {
    await getStateByCountry(id, setStates);
  };
  const handleFetchMicrolocation = async (id) => {
    await getMicrolocationByCity(id, setMicrolocations);
  };
  const handleFetchCountry = async () => {
    await getCountry(setCountry);
  };
  const handleFetchBrands = async () => {
    await getBrandsData(setBrands);
  };
  const handleFetchAmenity = async () => {
    await getAmenities(setAllAmenities);
  };
  const handleFetchCategory = async () => {
    await getCategory(setCategories);
  };

  useEffect(() => {
    if (amenties) {
      setCheckedAmenities(amenties);
    }
  }, [amenties]);

  const handleCheckboxChange = (event) => {
    const amenityId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the ID to the array if it's checked
      setCheckedAmenities((prevCheckedAmenities) => [
        ...prevCheckedAmenities,
        amenityId,
      ]);
    } else {
      // Remove the ID from the array if it's unchecked
      setCheckedAmenities((prevCheckedAmenities) =>
        prevCheckedAmenities.filter((id) => id !== amenityId)
      );
    }
  };

  useEffect(() => {
    handleFetchCountry();
    handleFetchBrands();
    handleFetchAmenity();
    handleFetchCategory();
    getWorkSpacesDataById();
  }, [updateTable]);
  const previewFile = (data) => {
    setAllImage((prevImages) => [...prevImages, ...data]);
  };
  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };

  const handleInputByClick = (e) => {
    const files = Array.from(e.target.files);
    handleUploadFile(files);
    const fileNames = files.map((file) => file.name);
    setFileName((prev) => [...prev, ...fileNames]);
  };
  useEffect(() => {
    const combinedArray = allimage.map((image, index) => ({
      image,
      name: fileName[index],
      alt: fileName[index],
    }));
    setMergedArray([...images, ...combinedArray]);
  }, [allimage, fileName, images]);

  const removePreviewImage = (index) => {
    const updatedArray = [...mergedArray]; // Create a copy of the mergedArray
    updatedArray.splice(index, 1); // Remove the element at the specified index

    setMergedArray(updatedArray);
  };
  const handleAltChange = (event, index) => {
    const updatedArray = [...mergedArray]; // Create a copy of the mergedArray
    updatedArray[index].alt = event.target.value; // Update the alt value at the specified index

    setMergedArray(updatedArray);
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
        <form style={{ textAlign: "left" }} onSubmit={handleEditWorkSpace}>
          <div className="container pt-4">
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
            {allContact?.map((row) => (
              <div className="row pt-3" key={row.id}>
                <div className="col-md-3">
                  <div
                    className="form-floating border_field"
                    style={{ marginTop: "6px" }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="User*"
                      name="user"
                      value={row.user}
                      onChange={(e) => handleInputContactChange(e, row.id)}
                    />
                    <label htmlFor="floatingInput">Name</label>
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
                      id="floatingInputSlug"
                      placeholder="Email*"
                      name="email"
                      value={row.email}
                      onChange={(e) => handleInputContactChange(e, row.id)}
                    />
                    <label htmlFor="floatingInputSlug">Email</label>
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
                      id="floatingInputSlug"
                      placeholder="Phone"
                      name="phone"
                      value={row.phone}
                      onChange={(e) => handleInputContactChange(e, row.id)}
                    />
                    <label htmlFor="floatingInputSlug">Phone</label>
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
                      id="floatingInputSlug"
                      placeholder="Designation"
                      name="designation"
                      value={row.designation}
                      onChange={(e) => handleInputContactChange(e, row.id)}
                    />
                    <label htmlFor="floatingInputSlug">Designation</label>
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
            <div className="row pt-4">
              <h4 className="property_form_h4">Coworking Details</h4>
              <div className="col-md-4">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputName"
                    placeholder="Name*"
                    name="name"
                    value={name}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInput">Name*</label>
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
                    id="floatingInput"
                    placeholder="Slug*"
                    name="slug"
                    value={slug}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInput">Slug*</label>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <select
                    className="form-select"
                    name="brand"
                    aria-label="Default select example"
                    value={brand}
                    onChange={handleInputChange}
                  >
                    <option>Select a brand</option>
                    {brands?.map((brand) => (
                      <option id={brand._id} key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <h4 className="propert_form_h4">Location</h4>
              <div className="col-md-3">
                <div>
                  <Select
                    placeholder="Country*"
                    value={selectedCountry}
                    options={countryOptions}
                    onChange={(selectedOption) =>
                      onChangeOptionHandler(selectedOption, "country")
                    }
                    isSearchable
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <Select
                    placeholder="State*"
                    value={selectedState}
                    options={stateOptions}
                    onChange={(selectedOption) =>
                      onChangeOptionHandler(selectedOption, "state")
                    }
                    isSearchable
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <Select
                    placeholder="City*"
                    value={selectedCity}
                    options={cityOptions}
                    onChange={(selectedOption) =>
                      onChangeOptionHandler(selectedOption, "city")
                    }
                    isSearchable
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <Select
                    placeholder="Microlocation*"
                    value={selectedMicroLocation}
                    options={microLocationOptions}
                    onChange={(selectedOption) =>
                      onChangeOptionHandler(selectedOption, "microLocation")
                    }
                    isSearchable
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Lattitude"
                    name="location"
                    value={location.latitude}
                    onChange={(event) =>
                      handleInputChangeObject(event, "location", "latitude")
                    }
                  />
                  <label htmlFor="floatingInput">Lattitude</label>
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
                    id="floatingInput"
                    placeholder="Longitude"
                    name="location"
                    value={location.longitude}
                    onChange={(event) =>
                      handleInputChangeObject(event, "location", "longitude")
                    }
                  />
                  <label htmlFor="floatingInput">Longitude</label>
                </div>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-md-4">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Postal Code"
                    name="postalCode"
                    value={location.postalCode}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInput">Postal Code</label>
                </div>
              </div>
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Address*"
                    name="location"
                    value={location.address}
                    onChange={(event) =>
                      handleInputChangeObject(event, "location", "address")
                    }
                    required
                  />
                  <label htmlFor="floatingInput">Address*</label>
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
              <div className="form-check">
                <div className="row">
                  <div className="form-check">
                    {allAmenities?.map((amenity) => (
                      <div key={amenity._id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={amenity._id}
                          id={`amenity-${amenity._id}`}
                          name="amenity"
                          checked={checkedAmenities.includes(amenity._id)}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`amenity-${amenity._id}`}
                        >
                          {amenity.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <h4 className="property_form_h4">Images</h4>
              <div className="container">
                <div>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleInputByClick}
                  />
                </div>
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
              </div>
              <div id="preview" className="d-flex align-items-center">
                <div
                  className="table-box"
                  style={{ width: "100%", marginTop: "0px" }}
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
                        {mergedArray?.map((img, index) => (
                          <Fragment key={index}>
                            <Tr>
                              <Td>{index + 1}</Td>
                              <Td>
                                <img src={img.image} alt="media" width="80px" />
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
            <div className="row">
              <h4 className="property_form_h4">Hours Of Operation</h4>
              <div className="col-md-3">Monday-Friday</div>
              <div className="col-md-2" style={{ paddingTop: "8px" }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="mon-fri"
                    id="flexCheckDefault"
                    onChange={(event) => toggleHoursHandler(event, "isOpen")}
                    checked={apiValues.isOpen}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Open
                  </label>
                </div>
              </div>
              {apiValues.isOpen && (
                <>
                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={hours_of_operation.monday_friday.from}
                        name="hours_of_operation.monday_friday.from"
                        onChange={handleInputChange2}
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
                        value={hours_of_operation.monday_friday.to}
                        onChange={handleInputChange2}
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
                    checked={apiValues.isOpenSat}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Open
                  </label>
                </div>
              </div>
              {apiValues.isOpenSat && (
                <>
                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={hours_of_operation.saturday.from}
                        name="hours_of_operation.saturday.from"
                        onChange={handleInputChange2}
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
                        value={hours_of_operation.saturday.to}
                        onChange={handleInputChange2}
                        name="hours_of_operation.saturday.to"
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
                    checked={apiValues.isOpenSun}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Open
                  </label>
                </div>
              </div>
              {apiValues.isOpenSun && (
                <>
                  <div className="col-md-2">
                    <div style={{ borderBottom: "1px solid #cccccc" }}>
                      <select
                        value={hours_of_operation.sunday.from}
                        name="hours_of_operation.sunday.from"
                        onChange={handleInputChange2}
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
                        value={hours_of_operation.sunday.to}
                        onChange={handleInputChange2}
                        name="hours_of_operation.sunday.to"
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
            {allplans.map((row) => (
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
                      <option value="month">month</option>
                      <option value="day">day</option>
                      <option value="year">year</option>
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
                      id="floatingInput"
                      placeholder="Price*"
                      name="price"
                      value={row.price}
                      onChange={(e) => handleInputPlanChange(e, row.id)}
                      required
                    />
                    <label htmlFor="floatingInput">Price*</label>
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
            <div className="row">
              <h4 className="property_form_h4">SEO Details</h4>
              <div className="col-md-6">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
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
              <div className="row">
                <div className="col-md-6">
                  <div
                    className="form-floating border_field"
                    style={{ marginTop: "6px" }}
                  >
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
                  <div
                    className="form-floating border_field"
                    style={{ marginTop: "6px" }}
                  >
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
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="form-floating border_field"
                    style={{ marginTop: "6px" }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Twitter Title"
                      name="seo.twitter.title"
                      value={seo?.twitter?.title}
                      onChange={handleInputChange2}
                    />
                    <label htmlFor="floatingInput">Twitter Title</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="form-floating border_field"
                    style={{ marginTop: "6px" }}
                  >
                    <textarea
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Twitter Description"
                      name="seo.twitter.description"
                      value={seo?.twitter?.description}
                      onChange={handleInputChange2}
                    />
                    <label htmlFor="floatingInput">Twitter Description</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Open Graph Title"
                    name="seo.open_graph.title"
                    value={seo?.open_graph?.title}
                    onChange={handleInputChange2}
                  />
                  <label htmlFor="floatingInput">Open Garph Title</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Open Graph Description"
                    name="seo.open_graph.description"
                    value={seo?.open_graph?.description}
                    onChange={handleInputChange2}
                  />
                  <label htmlFor="floatingInput">Open Graph Description</label>
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
};

export default EditWorkSpace;
