import { ref } from 'vue'
// import * as data from './weatherJson.json';
let data = null
if (process.env.NODE_ENV === 'development') {
    import('./weatherJson.json')
    .then((weatherData) => {
      data = weatherData.default
      // Use weatherData here
    })
    .catch((err) => {
      console.error(err)
    })
}
  

export function getWeather(locationRequest) {

    var urlExt = "";

    if (locationRequest.lat) {
        urlExt = `?lat=${locationRequest.lat.value}&long=${locationRequest.long.value}`
    }
    if (locationRequest.lat === false) {
        urlExt = `?lat=false&long=false&name=${locationRequest.name}`
    }
    const urlReq = `api/getWeather` + urlExt;
    // console.log("Initial", urlReq);
    return new Promise((resolve, reject) => {
        console.log("Initial");
        const location = ref(null);
        fetch(urlReq)
            .then(response => response.json())
            .then(data => {
                location.value = data
                // console.log(location.value)
                resolve(location.value)
            })
            .catch(error => {
                console.error('Error:', error, data.value);
                reject({error, data: data}, )
            });;
    })
}



