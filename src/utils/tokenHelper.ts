export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};
//console.log(localStorage,"localStorage");
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
