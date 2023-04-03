<template>
  <HomeView v-if="location" :nav="nav" :data="weatherData" :ready="dataReady" :theme="theme" @current-obj="newPage"
    @open-settings="openSettings" @city-search="(e) => { updateWeather({ lat: false, long: false, name: e }) }" />
  <div class="toast-bg">
    <div class="toast" v-if="showToast" @click="showMenu = true">
      Looking to turn on location? click here!
    </div>
  </div>
  <div class="menu-bg" v-if="showMenu" @click="hideMenuWhenBGClicked" ref="menu">
    <div class="menu">
      <h1 class="title">Settings</h1>
      <div class="menu-body">
        <p>
          Hi! Welcome to this weather dashboard. The design of this weather
          dashboard was taken from
          <a :href="designLink">here</a>.
        </p>
        <p>
          If this is your first time visiting this site. You will need to accept
          location permissions below so you can get a reading of the weather in
          your local area(See below!)
        </p>
        <p>
          <LocationSwitch @location-emit="setLocation"> </LocationSwitch>
        </p>
        <p>
          If you're interested in the codebase this can be found
          <a :href="designLink">here</a>.
        </p>
        <p>
          My Github can be found
          <a :href="designLink">here</a>.
        </p>
        <p>
          And you can see more work from my portfolio
          <a :href="designLink">here</a>.
        </p>
      </div>
    </div>
  </div>

  <PWAModal />
  <ThemeSwitch />
</template>

<script>
import { ref } from "@vue/reactivity";
import HomeView from "./components/HomePage.vue";
import LocationSwitch from "./components/LocationSwitch.vue";
import { getLocation } from "./composables/location";
import { getTheme } from "./composables/theme.js";
import { getWeather } from "./composables/weatherReponse";
import { storageManager } from "./composables/storage.js";
import { widthFunction } from "./composables/Mobile.js";
import { useWindowSize } from "vue-window-size";
import { watch, onMounted } from "@vue/runtime-core";
import PWAModal from "@/components/PWAModal.vue";
import ThemeSwitch from "@/components/ThemeSwitch.vue";

import { useRouter } from "vue-router";

export default {
  name: "AppView",
  components: {
    HomeView,
    LocationSwitch,
    PWAModal,
    ThemeSwitch,
  },
  setup() {
    const router = useRouter();

    const weatherData = ref(null);
    // const { width, height } = useWindowSize();
    const dataReady = ref(false);
    const allowLocation = ref(false);
    const designLink = "https://dribbble.com/shots/18070219-Cuacane-Dashboard";

    const latitude = ref(null);
    const longitude = ref(null);
    const positions = ref(null);
    const menu = ref(null);
    var showMenu = ref(false);
    const showToast = ref(true);

    const { storage } = storageManager();
    const { width, setMobile, getScreenCategory } = widthFunction();

    const openSettings = () => {
      showMenu.value = !showMenu.value;
    };

    var toastState = ref(true);
    const isToastVisible = () => {
      if (width < 600) {
        toastState.value = true;
        if (latitude.value) {
          toastState.value = false;
        }
        toastState.value = !dataReady.value;
      }

      return toastState.value;
    };

    var { theme } = getTheme();

    const setLocation = (locationData) => {
      latitude.value = locationData.latitude;
      longitude.value = locationData.longitude;
      positions.value = locationData.positions;

      console.log("errorStatus", locationData.locationError);
      if (locationData.locationError) {
        //this deals with location being turned off and any other errors
        latitude.value = false;
        longitude.value = false;
        positions.value = false;
        weatherData.value = false;
        dataReady.value = false;

        showToast.value = !dataReady.value;
        storage.storeData("show-toast", showToast.value); //don't showtoast as weather data is avaliable now
      } else {
        setTimeout(() => {
          if (latitude.value) {
            updateWeather({ lat: latitude.value, long: longitude.value, name: false });
          }
        });
      }
    };

    const updateWeather = (queryObj) => {
      console.log("checking query obj", queryObj)
      getWeather(queryObj)
        .then((data) => {
          weatherData.value = data;
          dataReady.value = true;
          refreshDataReady();
          showToast.value = !dataReady.value;
          storage.storeData("show-toast", showToast.value); //don't showtoast as weather data is avaliable now
        })
        .catch((error) => {
          console.error(error);

          weatherData.value = error.data;
          dataReady.value = true;
          refreshDataReady();
          showToast.value = !dataReady.value;
          storage.storeData("show-toast", showToast.value);

          if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "preview") {
            weatherData.value = false;
            dataReady.value = false;
            showToast.value = !dataReady.value;
            storage.storeData("show-toast", showToast.value); //don't showtoast as weather data is avaliable now
          } else {
            weatherData.value = error.data;
            dataReady.value = true;
            refreshDataReady();
            showToast.value = !dataReady.value;
            storage.storeData("show-toast", showToast.value);
          }
        });
    }

    const hideMenuWhenBGClicked = (event) => {
      if (event.target === menu.value) {
        showMenu.value = !showMenu.value;
      }
    };

    const nav = ref([
      {
        title: "Dashboard",
        link: "/",
        icon: "la-border-all",
        current: true,
        available: true,
      },
      {
        title: "Map",
        link: "/map",
        icon: "la-map-marked",
        current: false,
        available: true,
      },
      {
        title: "Search",
        link: "/search",
        icon: "la-search",
        current: false,
        available: true,
        bottom: true,
      },
      {
        title: "Saved Location",
        link: "/saved",
        icon: "la-hdd",
        current: false,
        available: false,
      },
      {
        title: "Calendar",
        link: "/calendar",
        icon: "la-calendar",
        current: false,
        available: false,
      },
    ]);

    const refreshDataReady = () => {
      dataReady.value = false;
      dataReady.value = true;
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

    onMounted(() => {
      if (!storage.doesDataExist("first-time")) {
        storage.storeData("first-time", false);
        showMenu.value = true;
      }

      if (storage.doesDataExist("show-toast")) {
        showToast.value = storage.getData("show-toast");
        if (!showToast.value) {
          getLocation()
            .then((data) => {
              latitude.value = data.latitude;
              longitude.value = data.longitude;
              positions.value = data.positions;

              setLocation({
                latitude: ref(data.latitude),
                longitude: ref(data.longitude),
                positions: ref(data.positions),
                locationError: false,
              });
            })
            .catch((err) => {
              console.log(err);
              setLocation({
                latitude: false,
                longitude: false,
                positions: false,
                locationError: true,
              });
            });
        }
      }
    });

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
      hideMenuWhenBGClicked,
      menu,
      openSettings,
      isToastVisible,
      toastState,
      storage,
      showToast,
      theme,
      setMobile, getScreenCategory, updateWeather,
    };
  },
};
</script>

<style lang="scss">
@import "./../node_modules/normalize.css/normalize.css";
@import "./stylesheets/theme-color.scss";
@import "./../node_modules/leaflet/dist/leaflet.css";
@import "https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--app-text-color);
  background: var(--app-background-color);

  display: grid;
  // grid-template-rows: 40px auto;
  grid-template-rows: auto;

  height: 100%;
  width: 100%;
  // min-height: 100vh;
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
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 10px;
      }
    }
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: var(--app-text-color);

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

a {
  text-decoration: underline;
}

.toast-bg {
  width: 100%;
  position: fixed;
  top: 50px;

  .toast {
    background: white;
    border-radius: 7px;
    margin: 0 auto;
    padding: 5px;
    width: 80%;
    max-width: 700px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }
}
</style>
