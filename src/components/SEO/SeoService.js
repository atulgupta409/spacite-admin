import axios from "axios";
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
    const { data } = await axios.get(`${BASE_URL}/api/seo/seos/${id}`);
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
    const { data } = await axios.get(`${BASE_URL}/api/seo/seos`);
    const newData = data.reverse();
    setSeos(newData);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};
