export const userList = async (
  axiosInstance,
  accessToken,
  { page, perPage }
) => {
  let path = `/manage/users?page=${page}&per_page=${perPage}`;
  return await axiosInstance.get(path, {
    headers: {
      Authorization: accessToken,
    },
  });
};
