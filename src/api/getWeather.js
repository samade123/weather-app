export default function handler(request, res) {

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');

  const { lat, long } = request.query;
  
  var axios = require('axios');
  var key = process.env.WEATHER_API_KEY;

  

  var config = {
    method: 'get',
    url: `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=51.3934149,0.1216487&days=7&aqi=no&alerts=no`,
    headers: {}
  };

  if (lat) {
    config.url = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${long}&days=7&aqi=no&alerts=no`
  }

  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      res.status(200).json(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
}

// export default function handler(request, response) {
//   const { name } = request.query;
//   response.status(200).send(`Hello ${name}!`);
// }