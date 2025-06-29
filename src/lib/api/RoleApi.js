// @ts-nocheck
export const roleList = async (
  axiosInstance,
  accessToken,
  { limit, offset, keyword = "" }
) => {
  const path = `/manage/roles?keyword=${keyword}&limit=${limit}&offset=${offset}`;
  return await axiosInstance.get(path, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const roleDelete = async (axiosInstance, accessToken, id) => {
  return await axiosInstance.delete(`/manage/roles/${id}`, {
    headers: {
      Authorization: accessToken,
    },
  });
};
