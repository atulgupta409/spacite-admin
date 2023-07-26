import axios from "axios";
import BASE_URL from "../../apiConfig";

export const getWorkSpaceDataByMicrolocation = async (
  setLoading,
  setWorkSpaces,
  id
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/workSpace/coworking/${id}`
    );

    setWorkSpaces(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};

export const getWorkSpaceDataByMicrolocationWithPriority = async (
  setLoading,
  setPriorityWorkSpaces,
  id
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/workSpace/priority-workspace/${id}`
    );

    setPriorityWorkSpaces(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};
