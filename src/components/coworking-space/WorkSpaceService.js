import axios from "axios";
import { config } from "../../services/Services";

export const getStateByCountry = async (countryId, setStates) => {
  try {
    const result = await axios.post(
      "/api/state/statesbycountry",
      { country_id: countryId },
      config
    );
    setStates(result.data);
  } catch (error) {
    console.log(error.message);
  }
};
export const getCityByState = async (stateId, setCities) => {
  try {
    await axios
      .post("/api/city/citybystate", { state_id: stateId }, config)
      .then((result) => {
        setCities(result.data);
      });
  } catch (error) {
    console.log(error);
  }
};

export const getMicrolocationByCity = async (cityId, setMicrolocations) => {
  try {
    await axios
      .post("/api/microlocation/microbycity", { city_id: cityId }, config)
      .then((result) => {
        setMicrolocations(result.data);
      });
  } catch (error) {
    console.log(error);
  }
};

export const getCountry = async (setCountry) => {
  try {
    const { data } = await axios.get("/api/allCountry/countries", config);

    setCountry(data.country);
  } catch (error) {
    console.log(error);
  }
};

export const getBrandsData = async (setBrands) => {
  try {
    const { data } = await axios.get("/api/brand/brands", config);
    setBrands(data);
  } catch (error) {
    console.log(error);
  }
};
export const getAmenities = async (setAmenities) => {
  try {
    const { data } = await axios.get("/api/amenity/amenities", config);

    setAmenities(data);
  } catch (error) {
    console.log(error);
  }
};
export const getCategory = async (setCategories) => {
  try {
    const { data } = await axios.get("/api/propertyType/propertyTypes", config);

    setCategories(data);
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (
  files,
  setProgress,
  setIsUploaded,
  previewFile
) => {
  const formData = new FormData();
  setProgress(0);
  files.forEach((file) => {
    formData.append("files", file, file.name);
  });
  await axios
    .post("/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setProgress(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      },
    })
    .then((res) => {
      previewFile(res.data);
      setTimeout(() => {
        setProgress(0);
      }, 3000);
      setIsUploaded(true);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getWorkSpaceData = async (setLoading, setWorkSpaces) => {
  try {
    setLoading(true);
    const { data } = await axios.get("/api/workSpace/workSpaces", config);
    setLoading(false);
    setWorkSpaces(data);
  } catch (error) {
    console.log(error);
  }
};

export const changeWorkSpaceStatus = async (
  id,
  action,
  setUpdateTable,
  toast
) => {
  try {
    const { data } = await axios.put(
      `/api/workSpace/workSpaces/changeStatus/${id}`,
      { status: action },
      config
    );
    setUpdateTable((prev) => !prev);
    toast({
      title: "Update Successfully!",
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
