import { ref } from 'vue'
// import * as data from './weatherJson.json';
export function getWeather(locationRequest) {

    var urlExt = "";

    // console.log(locationRequest.lat.value,"request")
    if (locationRequest.lat) {
        urlExt = `?lat=${locationRequest.lat.value}&long=${locationRequest.long.value}`
    }
    const urlReq = `api/getWeather` + urlExt;
    return new Promise((resolve, reject) => {
        console.log("Initial");
        const location = ref(null);
        fetch(urlReq)
            .then(response => response.json())
            .then(data => {
                location.value = data
                console.log(location.value)
                resolve(location.value)
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error)
            });;
    })
}


