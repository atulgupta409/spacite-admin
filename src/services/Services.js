import Cookies from "js-cookie";
import BASE_URL from "../apiConfig";
import axios from "axios";
import imageCompression from "browser-image-compression";

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

  // Compress and append each file to the form data
  const options = {
    maxSizeMB: 0.8, // Maximum size in megabytes 1200*756
    maxWidthOrHeight: 1200, // Maximum width or height (whichever is larger)
  };

  const compressedFiles = await Promise.all(
    files.map((file) => imageCompression(file, options))
  );

  compressedFiles.forEach((file) => {
    formData.append("files", file, file.name);
  });

  await axios
    .post(`${BASE_URL}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setProgress(
          parseInt((progressEvent.loaded * 100) / progressEvent.total)
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
