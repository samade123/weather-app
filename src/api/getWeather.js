var axios = require('axios');
module.exports = async (request, res) => {

  var config = {
    method: 'get',
    url: 'http://api.weatherapi.com/v1/forecast.json?key=98ffae9a4d174a51b15180411220507&q=51.3934149,0.1216487&days=1&aqi=no&alerts=no',
    headers: {}
  };

  axios(config)
    .then(function(response) {
      console.log(JSON.stringify(response.data));
      res.json(response.data)
    })
    .catch(function(error) {
      console.log(error);
    });
}