// @ts-nocheck
export const menuList = async (axiosInstance, accessToken) => {
  return await axiosInstance.get("/manage/menus", {
    headers: {
      Authorization: accessToken,
    },
  });
};
