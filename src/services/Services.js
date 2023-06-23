export const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

export const postConfig = {
  headers: {
    "Content-type": "application/json",

    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};
