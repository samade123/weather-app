<template>
  <div class="outer">
    <div class="top" v-if="!props.mobile && props.theme == 'old'"></div>
    <div class="middle" v-if="props.theme == 'old'">
      <div class="today-board" ref="today">
        <div class="left">
          <div class="left-top old">
            <div class="location-name">
              <div class="icon"><i class="las la-map-marker"></i></div>
              <div>{{ location ? location.name : ".." }}</div>
            </div>
            <div class="location-date">{{ location ? location.localtime.substring(11) : ".." }}<i class="las la-lg la-cog"
                @click="openSettings"></i></div>
          </div>
          <div class="left-middle">
            <div class="temp">{{ current ? current.temp_c : "0" }}<span class="small"> &#8451</span></div>
            <div class="cloudy">{{ current ? current.condition.text : "Mostly Clear" }}</div>
          </div>
          <div class="left-bottom old">
            <div class="lb-left">
              <i class="las la-tachometer-alt"></i>
              {{ current ? current.pressure_in : ".." }}
            </div>
            <div class="lb-middle">
              <i class="las la-tint"></i>
              {{ current ? current.precip_in : ".." }}
            </div>
            <div class="lb-right">
              <i class="las la-wind"></i>
              {{ current ? current.wind_kph : ".." }}
            </div>
          </div>
        </div>
        <div class="right" v-if="props.theme == 'old'">
          <div class="temp-board">
            <lineChart v-if="forecast" :data="dataArray" :theme="props.theme" />
          </div>
        </div>
      </div>
    </div>

    <div class="middle new" v-if="props.theme == 'new'">
      <div class="title">Your weather</div>
      <div class="temp-summary">
        <div class="temp">{{ current ? current.temp_c : "0" }}<span class="small"> &#176;</span></div>
        <div class="location">
          <div class="location-name">
            <div>{{ location ? location.name : ".." }}</div>
          </div>
          <div class="location-date">
            <div>{{ location ? getTime(location.localtime) : ".." }}</div>
            <div>{{ location ? getDay(location.localtime) : ".." }}</div>
            <div>{{ location ? getMonth(location.localtime) : ".." }}</div>
            <!-- {{ location ? location.localtime.substring(11) : ".." }} -->
          </div>

        </div>
        <div class="condition">
          <WeatherSVG />
          <div class="cloudy">{{ current ? current.condition.text : "Mostly Clear" }}</div>
        </div>
      </div>
      <div class="spacer condition">
      </div>
    </div>
    <div class="bottom" v-if="props.mobile">
      <div class="weather-title">Today <span> Next 7 days</span> </div>
      <WeatherStrip :data="props.data" :upperLimit="upperLimit" :dateCounter="dateCounter" :windowWidth="windowWidth" />
    </div>
    <div class="bottom" v-else>
      <div class="stats-card">
        <div class="stats-left">
          <div class="title">Wind</div>
          <div class="sub-title">Today's Wind Speed</div>
          <div class="number">
            {{ current ? current.wind_kph : ".." }}
          </div>
        </div>
        <i class="las la-compass la-5x"></i>
      </div>
      <div class="stats-card">
        <div class="stats-left">
          <div class="title">Rain Chance</div>
          <div class="sub-title">Today's Chance of Rain</div>
          <div class="number">
            {{ forecast ? forecast.forecastday[0].day.daily_chance_of_rain : ".." }}
          </div>
        </div>
        <i class="las la-tachometer-alt la-5x"></i>
      </div>
      <div class="stats-card">
        <div class="stats-left">
          <div class="title">Pressure</div>
          <div class="sub-title">Today's Pressure</div>
          <div class="number">
            {{ current ? current.pressure_in : ".." }}
          </div>
        </div>
        <i class="las la-5x la-weight-hanging"></i>
      </div>
      <div class="stats-card">
        <div class="stats-left">
          <div class="title">UV Index</div>
          <div class="sub-title">Today's UV Index</div>
          <div class="number">
            {{ current ? current.uv : ".." }}
          </div>
        </div>
        <i class="las la-sun la-5x"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import WeatherStrip from "@/components/WeatherStrip.vue";
import { storageManager } from "@/composables/storage.js";
import LineChart from "@/components/Chart.vue";
import WeatherSVG from "@/components/WeatherSVG.vue";
import { useRouter } from "vue-router";
import { onMounted, watch } from "@vue/runtime-core";
export default {
  emits: ["openSettings"],
  props: ["mobile", "data", "ready", "theme"],
  components: {
    WeatherStrip,
    LineChart,
    WeatherSVG,
  },
  setup(props, ctx) {
    const publicPath = process.env.BASE_URL;
    const { storage } = storageManager();

    const location = ref(null);
    const current = ref(null);
    const forecast = ref(null);
    const upperLimit = ref(4);
    const dateCounter = ref(1);
    const windowWidth = ref(props.windowWidth);
    const dataArray = ref([]);
    const backgroundJPG = ref(`url(${require("@/assets/background.jpg")})`);
    const today = ref(null);

    const router = useRouter();

    const shout = () => {
      console.log("Sadasds");
    };

    const getDay = (date) => {
      const newDate = new Date(date);
      const options = { weekday: "long" };

      return new Intl.DateTimeFormat("en-US", options).format(newDate);
    };

    const getMonth = (date) => {
      const newDate = new Date(date);
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      return date.substring(8, 10) + " " + month[newDate.getMonth()];
    };
    const getTime = (date) => {
      const newDate = new Date(date);
      return date.substring(10);
    };

    const openSettings = () => {
      ctx.emit("openSettings");
    };

    const setTheme = () => {
      console.log("running theming");
      const themes = {
        Sunny: {
          theme: "sunny-light",
          img: `url(${require("@/assets/background-clear-skies.jpg")})`,
        },
        "Partly cloudy": {
          theme: "normal",
          img: `url(${require("@/assets/background.jpg")})`,
        },
        Cloudy: {
          theme: "clear-dark",
          img: `url(${require("@/assets/background-cloudy.jpg")})`,
        },
        rain: {
          theme: "rain-dark",
          img: `url(${require("@/assets/background-cloudy.jpg")})`,
        },
        Clear: {
          theme: "clear-light",
          img: `url(${require("@/assets/background-clear-skies-1.jpg")})`,
        },
      };

      let themeType = storage.getData('theme') // check are we using old theem or new theme - only change the background image if we are onold theme
      let condition = current.value.condition.text.includes("rain")
        ? "rain"
        : current.value.condition.text;
      console.log(condition, themes[condition]);
      let htmlElement = document.documentElement;
      if (themeType == 'old') {
      if (themes.hasOwnProperty(condition)) {
        htmlElement.setAttribute("theme", themes[condition].theme);
        today.value.style.backgroundImage = themes[condition].img;
      } else {
        htmlElement.setAttribute("theme", themes["Partly cloudy"].theme);
        today.value.style.backgroundImage = themes["Partly cloudy"].img;
        }
      }
    };
    watch(
      props,
      (props) => {
        if (props.ready) {
          location.value = props.data.location;
          current.value = props.data.current;
          forecast.value = props.data.forecast;
          forecast.value.forecastday[0].hour.forEach((element) => {
            var index = forecast.value.forecastday[0].hour.indexOf(element);
            if (
              index == 6 ||
              index == 9 ||
              index == 11 ||
              index == 13 ||
              index == 18 ||
              index == 22
            ) {
              dataArray.value.push(element);
            }
          });
          setTheme();
        }
      },
      { immediate: false, deep: false }
    );
    onMounted(() => {
      if (props) {
        if (props.ready) {
          location.value = props.data.location;
          current.value = props.data.current;
          forecast.value = props.data.forecast;

          forecast.value.forecastday[0].hour.forEach((element) => {
            var index = forecast.value.forecastday[0].hour.indexOf(element);
            if (
              index == 6 ||
              index == 9 ||
              index == 11 ||
              index == 13 ||
              index == 18 ||
              index == 22
            ) {
              dataArray.value.push(element);
            }
          });
        }
      }
    });
    return {
      publicPath,
      props,
      location,
      current,
      forecast,
      dataArray,
      dateCounter,
      upperLimit,
      windowWidth,
      shout,
      openSettings,
      backgroundJPG,
      today,
      getDay,
      getMonth,
      getTime,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "./../stylesheets/dashboard/theme-old.scss" as *;
@use "./../stylesheets/dashboard/theme-new.scss" as *;
</style>