import axios from "axios";
import { config } from "../../services/Services";
import BASE_URL from "../../apiConfig";
export const getStateByCountry = async (countryId, setStates) => {
  try {
    const result = await axios.post(
      `${BASE_URL}/api/state/statesbycountry`,
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
      .post(`${BASE_URL}/api/city/citybystate`, { state_id: stateId }, config)
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
      .post(
        `${BASE_URL}/api/microlocation/microbycity`,
        { city_id: cityId },
        config
      )
      .then((result) => {
        setMicrolocations(result.data);
      });
  } catch (error) {
    console.log(error);
  }
};

export const getCountry = async (setCountry) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/allCountry/countries`,
      config
    );

    setCountry(data.country);
  } catch (error) {
    console.log(error);
  }
};

export const getBrandsData = async (setBrands) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/brand/brands`, config);
    setBrands(data);
  } catch (error) {
    console.log(error);
  }
};
export const getAmenities = async (setAmenities) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/amenity/amenities`,
      config
    );

    setAmenities(data);
  } catch (error) {
    console.log(error);
  }
};
export const getCategory = async (setCategories) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/propertyType/propertyTypes`,
      config
    );

    setCategories(data);
  } catch (error) {
    console.log(error);
  }
};

export const getWorkSpaceData = async (setLoading, setWorkSpaces) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/workSpace/workSpaces`,
      config
    );
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
      `${BASE_URL}/api/workSpace/workSpaces/changeStatus/${id}`,
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
