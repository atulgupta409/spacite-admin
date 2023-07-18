import axios from "axios";
import BASE_URL from "../../apiConfig";

export const getWorkSpaceDataByMicrolocation = async (
  setLoading,
  setWorkSpaces,
  name
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/workSpace/coworking/${name}`
    );  

    setWorkSpaces(data.coworkingSpaces);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};

export const getWorkSpaceDataByMicrolocationWithPriority = async (
  setLoading,
  setPriorityWorkSpaces,
  name
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/workSpace/priority-workspace/${name}`
    );

    setPriorityWorkSpaces(data.coworkingSpaces);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};
