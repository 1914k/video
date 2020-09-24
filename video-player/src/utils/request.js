const instance = this.$axios.create({
  baseURL: 'http://192.168.7.119:8080/api',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

export default instance