import { Navigate } from "react-router";

export const authLogin = async (axiosInstance, { email, password }) => {
  const path = `/auth/login`;

  return await axiosInstance.post(path, {
    email,
    password,
  });
};

export const authToken = async (axiosInstance, refreshToken) => {
  const path = `/auth/token`;
  return await axiosInstance.post(
    path,
    { refreshToken }, // body
    {
      skipAuthInterceptor: true,
    }
  );
};
