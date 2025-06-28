export const userList = async (
  axiosInstance,
  accessToken,
  { limit, offset, keyword = "" }
) => {
  let path = `/manage/users?keyword=${keyword}&limit=${limit}&offset=${offset}`;
  console.log("Fetching users from path:", path);
  return await axiosInstance.get(path, {
    headers: {
      Authorization: accessToken,
    },
  });
};
