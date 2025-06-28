export const userList = async (
  axiosInstance,
  accessToken,
  { limit, offset, keyword = "" }
) => {
  let path = `/manage/users?keyword=${keyword}&limit=${limit}&offset=${offset}`;
  return await axiosInstance.get(path, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const userDelete = async (axiosInstance, accessToken, id) => {
  return await axiosInstance.delete(`/manage/users/${id}`, {
    headers: {
      Authorization: accessToken,
    },
  });
};
