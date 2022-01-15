import axios from 'axios';

(async () => {
  console.time('req');

  const response = await axios.request({
    url: 'https://api.github.com/user',
    method: 'GET',
    headers: {
      Authorization: 'Bearer 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',
      Accept: 'application/json',
    },
  });

  console.log(response.config);

  console.log(response.data);
  console.timeEnd('req');
})();
