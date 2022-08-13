import { ref } from 'vue'
export function getLocation() {

  const latitude = ref("")
  const longitude = ref("")
  const positions = ref(null)


  return new Promise((resolve, reject) => {

    const success = (position) => {
      positions.value = position
      latitude.value = position.coords.latitude;
      longitude.value = position.coords.longitude;

      console.log("success")
      resolve({
        latitude,
        longitude,
        positions,
      })
    }

    const error = () => {
      console.error("Unable to retrieve your location")

      reject({
        latitude,
        longitude,
        positions,
      })
    }

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser')

      reject({
        latitude,
        longitude,
        positions,
      })
    } else {
      console.debug("Locating...")
      navigator.geolocation.getCurrentPosition(success, error);
    }

  })
}