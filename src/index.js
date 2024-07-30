axios.post('/api/v1/signup', { username: 'newuser', password: '123456' }).then((response) => {
  console.log(response.data);
});
