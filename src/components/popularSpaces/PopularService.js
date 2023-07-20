import axios from "axios";
import BASE_URL from "../../apiConfig";

export const getWorkSpaceDataByCity = async (
  setLoading,
  setWorkSpaces,
  cityId
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/workSpace/coworking-details/${cityId}`
    );

    setWorkSpaces(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};

export const getPopularWorkSpaceDataByCity = async (
  setLoading,
  setPriorityWorkSpaces,
  cityId
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/workSpace/popular-workspace/${cityId}`
    );

    setPriorityWorkSpaces(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};
