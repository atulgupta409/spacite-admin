import axios from "axios";

import BASE_URL from "../../apiConfig";

export const getBrandsDataById = async (
  setLoading,
  setIsChecked,
  setIndexed,
  setBrands,
  id
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/api/brand/brands/${id}`);
    setIsChecked(data.seo.index);
    setIndexed(data.seo.robots);
    setLoading(false);
    setBrands(data);
  } catch (error) {
    console.log(error);
  }
};

export const getCity = async (setAllCity) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/city/cities`);
    setAllCity(data);
  } catch (error) {
    console.log(error);
  }
};
