import Cookies from "js-cookie";
import BASE_URL from "../apiConfig";
import axios from "axios";

export const config = {
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
};

export const postConfig = {
  headers: {
    "Content-type": "application/json",

    Authorization: `Bearer ${Cookies.get("token")}`,
  },
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
    .post(`${BASE_URL}/upload-image`, formData, {
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
