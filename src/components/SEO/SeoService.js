import axios from "axios";
import { config } from "../../services/Services";
import BASE_URL from "../../apiConfig";

export const getSeoDataById = async (
  setLoading,
  setSeos,
  setIsChecked,
  setIndexed,
  id
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/api/seo/seos/${id}`, config);
    setIsChecked(data.index);
    setIndexed(data.robots);
    setLoading(false);
    setSeos(data);
  } catch (error) {
    console.log(error);
  }
};

export const getSeoData = async (setLoading, setSeos) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/api/seo/seos`, config);
    setLoading(false);
    setSeos(data);
  } catch (error) {
    console.log(error);
  }
};
