export const host = "http://localhost:7800";

export const registerRoute = `${host}/auth/api/signup`;
export const loginRoute = `${host}/auth/api/login`;
export const setAvatarRoute = `${host}/auth/api/setAvatar`;
export const getUsersRoute = `${host}/auth/api/allUsers`;
export const refreshTokenRoute = `${host}/auth/api/refreshToken`;
export const verifyUserRoute = `${host}/auth/api/verify`;
export const logoutRoute = `${host}/auth/api/logout`;
export const sendMsgRoute= `${host}/auth/message/addMsg`;
export const getMsgRoute= `${host}/auth/message/getMsg`;