export default {
  getBaseUrl() {
    let url = ''
    if (
      process.env.VUE_APP_IDENTITY &&
      process.env.VUE_APP_IDENTITY === 'BACKEND'
    ) {
      url = 'http://localhost:8081'
    } else if (
      process.env.VUE_APP_IDENTITY &&
      process.env.VUE_APP_IDENTITY === 'FRONT'
    ) {
      url = 'http://upfiledev.h5more.com'
    }
    if (process.env.NODE_ENV !== 'development') {
      url = ''
    }
    return url
  }
}