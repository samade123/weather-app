import { ref } from 'vue'
export function getLocation() {
  // const status = document.querySelector('#status');
  // const mapLink = document.querySelector('#map-link');

  // mapLink.href = '';
  // mapLink.textContent = '';

  const latitude = ref("")
  const longitude = ref("")
  const positions = ref(null)
  // const locationError = ref(false);

  const success = (position) => {
    positions.value = position
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;
    // console.log(positions)

    // status.textContent = '';
    // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  }

  const error = () => {
    // status.textContent = 'Unable to retrieve your location';
    console.error("Unable to retrieve your location")
  }

  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by your browser')
    // status.textContent = 'Geolocation is not supported by your browser';
  } else {
    // status.textContent = 'Locating…';
    console.debug("Locating...")
    navigator.geolocation.getCurrentPosition(success, error);
  }
  return {
    latitude,
    longitude,
    positions
  }
}