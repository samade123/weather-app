<template>
  <HomeView
    v-if="location"
    :nav="nav"
    :data="weatherData"
    :ready="dataReady"
    @current-obj="newPage"
  />

  <div class="menu-bg">
    <div class="menu">
      <h1 class="title">Settings</h1>
      <div class="menu-body">
        <p>
          Hi! Welcome to this weather dashboard. The design of this weather
          dashboard was taken from
          <a :href="designLink">here. </a>
        </p>
        <p>
          If this is your first time visiting this site. You will need to accept
          location permissions below so you can get a reading of the weather in
          your local area(See below!)
        </p>
        <p>
          <LocationSwitch @location-emit="setLocation"> </LocationSwitch>
          {{ latitude ? latitude : "Adsad" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import HomeView from "./components/HomePage.vue";
import LocationSwitch from "./components/LocationSwitch.vue";
import { getWeather } from "./composables/weatherReponse";
import { useWindowSize } from "vue-window-size";
import { watch } from "@vue/runtime-core";

import { useRouter } from "vue-router";

export default {
  name: "AppView",
  components: {
    HomeView,
    LocationSwitch,
  },
  setup() {
    const router = useRouter();

    const weatherData = ref(null);
    const { width, height } = useWindowSize();
    const dataReady = ref(false);
    const showMenu = ref(false);
    const allowLocation = ref(false);
    const designLink = "https://dribbble.com/shots/18070219-Cuacane-Dashboard";

    // const { latitude, longitude, positions } = getLocation();
    const latitude = ref(null);
    const longitude = ref(null);
    const positions = ref(null);

    const setLocation = (locationData) => {
      console.log("sdad");

      latitude.value = locationData.latitude;
      longitude.value = locationData.longitude;
      positions.value = locationData.positions;

      // if (latitude.value) {
      //   getWeather(latitude.value, longitude.value)
      //     .then((data) => {
      //       weatherData.value = data;
      //       dataReady.value = true;
      //     })
      //     .catch((error) => console.error(error));
      // }
    };
    getWeather()
      .then((data) => {
        weatherData.value = data;
        dataReady.value = true;
      })
      .catch((error) => console.error(error));

    const nav = ref([
      { title: "Dashboard", link: "/", icon: "la-border-all", current: true },
      { title: "Map", link: "/map", icon: "la-map-marked", current: false },
      {
        title: "Saved Location",
        link: "/saved",
        icon: "la-hdd",
        current: false,
      },
      {
        title: "Calendar",
        link: "/calendar",
        icon: "la-calendar",
        current: false,
      },
    ]);

    const refreshDataReady = () => {
      // if (dataReady.value) {
      dataReady.value = false;
      dataReady.value = true;
      // }
    };

    const newPage = (linkObj) => {
      nav.value.forEach((linkObj) => {
        linkObj.current = false;
      });
      const newVal = nav.value.find((link) => link == linkObj);
      newVal.current = true;

      router.push(linkObj.link);

      refreshDataReady();
    };

    watch(
      width,
      (width) => {
        refreshDataReady();
      },
      { immediate: false }
    );

    return {
      nav,
      newPage,
      latitude,
      longitude,
      positions,
      location,
      weatherData,
      dataReady,
      showMenu,
      designLink,
      allowLocation,
      setLocation,
    };
  },
};
</script>

<style lang="scss">
@import "./../node_modules/normalize.css/normalize.css";
@import "./../node_modules/leaflet/dist/leaflet.css";
@import "https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: grid;
  // grid-template-rows: 40px auto;
  grid-template-rows: auto;

  height: 100%;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;

  // max-width: 1400px;
  margin: 0 auto;
}

body {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.menu-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  background: #2c3e5000;
  .menu {
    background: white;
    border: solid black;
    margin: 0 auto;

    height: 80vh;
    width: 80vw;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .menu-body {
      max-width: 80%;
      display: grid;
      grid-gap: 20px;
      place-items: center;

      .input-switch {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
      }
    }
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
