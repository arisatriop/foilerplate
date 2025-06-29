// @ts-ignore
export const authLogin = async (axiosInstance, { email, password }) => {
  const path = `/auth/login`;

  return await axiosInstance.post(path, {
    email,
    password,
  });
};

// @ts-ignore
export const authLogout = async (axiosInstance, accessToken) => {
  const path = `/auth/logout`;
  console.log("authLogout called with accessToken:", accessToken);
  return await axiosInstance.post(
    path,
    {},
    {
      headers: {
        Authorization: accessToken,
      },
    }
  );
};

// @ts-ignore
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

// @ts-ignore
export const currentUser = async (axiosInstance, accessToken) => {
  return axiosInstance.get("/auth", {
    headers: {
      Authorization: accessToken,
    },
  });
};
