import * as data from './weatherJson.json';
export function getWeather() {
    const { location } = data;
    console.log(location.name)
return {location}
}