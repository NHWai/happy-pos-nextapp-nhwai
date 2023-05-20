export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return "";
};

export const getLocationId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedLocation");
  }
  return "";
};
