<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <!-- <router-view /> -->

  <HomeView
    :nav="nav"
    :data="weatherData"
    :ready="dataReady"
    @current-obj="newPage"
  />
</template>

<script>
import { ref } from "@vue/reactivity";
import HomeView from "./components/HomePage.vue";
import { getLocation } from "./composables/location";
import { getWeather } from "./composables/weatherReponse";

import { useRouter } from "vue-router";

export default {
  name: "AppView",
  components: {
    HomeView,
  },
  setup() {
    const router = useRouter();
    const { latitude, longitude, positions } = getLocation();
    const weatherData = ref(null);
    const dataReady = ref(false);

    getWeather()
      .then((data) => {
        weatherData.value = data;
        dataReady.value = true;
        console.log(weatherData.value, "weatherData value");
      })
      .catch((error) => console.error(error));

    // console.log(longitude.value, latitude.value, positions.value);

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

    // onMounted(async () => {
    //   const location  = await getWeather();
    //   // console.log(location.value)
    // });

    const newPage = (linkObj) => {
      // console.log(nav.value);
      nav.value.forEach((linkObj) => {
        linkObj.current = false;
      });
      const newVal = nav.value.find((link) => link == linkObj);
      newVal.current = true;

      router.push(linkObj.link);

        dataReady.value = false;
        dataReady.value = true;

    };

    return {
      nav,
      newPage,
      latitude,
      longitude,
      positions,
      location,
      weatherData,
      dataReady,
    };
  },
};
</script>

<style lang="scss">
@import "./../node_modules/normalize.css/normalize.css";
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
