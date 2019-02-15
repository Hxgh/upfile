/* eslint-disable no-console */
/**
 * @param {string} TOKEN_KEY 当前登录信息
 */
const TOKEN_KEY = 'token'

export const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token);
}
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
}

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  let data = token ? JSON.parse(token) : '';
  if (data && data.token && data.time && data.time > Math.floor(new Date().getTime() / 1000)) {
    return data.token
  } else {
    return false
  }
}

export const login = (token, time) => {
  let data = JSON.stringify({
    token: token,
    time: time || Math.floor(new Date().getTime() / 1000),
  });
  setToken(data);
  window.app.$router.push({
    path: '/'
  });
}

export const logout = () => {
  removeToken();
  window.app.$router.replace({
    path: '/login'
  })
}