import { ref } from 'vue'
// import * as data from './weatherJson.json';
export function getWeather() {
    return new Promise((resolve, reject) => {
        console.log("Initial");
        const location = ref(null);
        fetch("api/getWeather")
            .then(response => response.json())
            .then(data => {
                location.value = data
                // console.log(location.value)
                resolve(location.value)
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error)
            });;
    })
}


