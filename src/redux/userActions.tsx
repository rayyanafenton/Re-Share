export const setUser = (user: any) => ({
  type: "SET_USER",
  payload: user,
});

export const updateUser = (data: any) => ({
  type: "UPDATE_USER",
  payload: data,
});

export const clearUser = () => ({
  type: "CLEAR_USER",
});
