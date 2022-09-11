<template>
  <div class="outer">
    <div class="top" v-if="!props.mobile"></div>
    <div class="middle">
      
      <!-- <div
        class="today-board" ref="today"
        :style="{
          backgroundImage: 'url(' + require('@/assets/background.jpg') + ')',
        }"
      >  -->

      <!-- <div
        class="today-board" ref="today"
        :style="{
          backgroundImage: backgroundJPG,
        }"
      >  -->

      <div class="today-board" ref="today"> 
      <div class="left">
          <div class="left-top">
            <div class="location-name"><div class="icon"><i class="las la-map-marker"></i></div><div>{{location? location.name : ".."}}</div></div>
          
            <div class="location-date">{{location? location.localtime.substring(11) : ".."}}<i class="las la-lg la-cog" @click="openSettings"></i></div>
          </div>
          <div class="left-middle">
            <div class="temp">{{current? current.temp_c : "0"}}<span class="small"> &#8451</span></div>
            <div class="cloudy">{{current? current.condition.text : "Mostly Clear"}}</div>
          </div>
          <div class="left-bottom">
            <div class="lb-left">

              <i class="las la-tachometer-alt"></i>
              {{current? current.pressure_in : ".."}}
            </div>
            <div class="lb-middle">
              <i class="las la-tint"></i>
                {{current? current.precip_in : ".."}}
            </div>
            <div class="lb-right">
              <i class="las la-wind"></i>
                {{current? current.wind_kph : ".."}}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="temp-board">
            <lineChart  v-if="forecast" :data="dataArray"/>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="props.mobile" >
    <div class="weather-title">Today <span> Next 7 days</span> </div>
      <WeatherStrip :data="props.data" :upperLimit="upperLimit" :dateCounter="dateCounter" :windowWidth="windowWidth"/>
    </div>
    <div class="bottom" v-else>
      <div class="stats-card">
        <div class="stats-left">
        <div class="title">Wind</div>
        <div class="sub-title">Today's Wind Speed</div>
        <div class="number">
          {{current? current.wind_kph : ".."}}
        </div>
          </div>
        <i class="las la-compass la-5x"></i>
      </div>
      <div class="stats-card">
        <div class="stats-left">
          <div class="title">Rain Chance</div>
          <div class="sub-title">Today's Chance of Rain</div>
          <div class="number">
            {{forecast? forecast.forecastday[0].day.daily_chance_of_rain : ".."}}
          </div>
        </div>
          <i class="las la-tachometer-alt la-5x"></i>
      </div>
      <div class="stats-card">
        <div class="stats-left">
          <div class="title">Pressure</div>
          <div class="sub-title">Today's Pressure</div>
          <div class="number">
            {{current? current.pressure_in : ".."}}
          </div>
        </div>
          <i class="las la-5x la-weight-hanging"></i>
      </div>
      <div class="stats-card">
        <div class="stats-left">
          <div class="title">UV Index</div>
          <div class="sub-title">Today's UV Index</div>
          <div class="number">
                {{current? current.uv : ".."}}
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
import LineChart from "@/components/Chart.vue";
import { useRouter } from "vue-router";
import { onMounted, watch } from "@vue/runtime-core";
export default {
  emits: ["openSettings"],
  props: ["mobile", "data", "ready"],
  components: {
    WeatherStrip,
    LineChart,
  },
  setup(props, ctx) {
    const publicPath = process.env.BASE_URL;

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
        "Clear": {
          theme: "clear-light",
          img: `url(${require("@/assets/background-clear-skies-1.jpg")})`,
        },
      };

      let condition = current.value.condition.text.includes("rain")
        ? "rain"
        : current.value.condition.text;
      console.log(condition, themes[condition]);
      let htmlElement = document.documentElement;
      if (themes.hasOwnProperty(condition)) {
        htmlElement.setAttribute("theme", themes[condition].theme);
        today.value.style.backgroundImage = themes[condition].img;
      } else {
        htmlElement.setAttribute("theme", themes["Partly cloudy"].theme);
        today.value.style.backgroundImage = themes["Partly cloudy"].img;
      }
    };
    watch(
      props,
      (props) => {
        // console.log("sadasd");
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
      // console.log(today.value.style.backgroundImage);

      // today.value.style.backgroundImage = `url(${require("@/assets/background.jpg")})`;
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
    };
  },
};
</script>

<style lang="scss" scoped>
div.outer {
  display: grid;
  grid-template-rows: 1fr 4fr 4fr;
  height: 100vh;
  //   width: 100%;
  grid-gap: 10px;
  border: solid 0 5px 0 0 #e6ebf4;
  //   .top {
  //     background: orange;

  min-height: 100vh;
  overflow: scroll;

  @media (max-width: 600px) {
    grid-template-rows: 4fr 2fr;
  }
  //   }
  .middle {
    display: grid;
    place-items: center;
    color: var(--dynamic-text-color);
    // overflow: auto;
    .today-board {
      height: 100%;
      width: clamp(95%, calc(94% + 20px), 98%);
      background: var(--dynamic-background-color);
      background-size: cover;
      border-radius: 8px;

      display: grid;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        margin-top: 10px;
      }

      .left {
        display: grid;
        grid-template-rows: 1fr 8fr 1fr;
        .left-top {
          display: flex;
          justify-content: space-around;
          .location-name {
            display: flex;
            text-align: center;
            // position: relative;
            & > * {
              margin: 10px 0 0 0;
            }
            // place-items: center;
            // grid-template-rows: auto;
          }

          .location-date {
            margin: 10px 0 0 0;

            i {
              margin-left: 10px;
            }
          }
        }
        .left-middle {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;

          .temp {
            font-weight: bold;
            font-size: 6rem;
          }
          .small {
            font-weight: 500;
            font-size: 2rem;
          }
          text-align: center;
          div {
            text-align: center;
          }
          .cloudy {
            font-size: 20px;
          }
        }
        .left-bottom {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .right {
        display: grid;
        place-items: center;
        .temp-board {
          height: 95%;
          width: 90%;
          background: var(--dynamic-background-color-transparent);
          border-radius: 7px;
        }
      }
    }
  }
  .bottom {
    .weather-title {
      display: flex;
      justify-content: space-around;
    }
    display: grid;
    grid-template-rows: auto 1fr;
    grid-gap: 20px;

    @media (min-width: 600px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-gap: 20px 25px;
    }
    // padding: 5px;
    width: clamp(95%, calc(94% + 20px), 98%);
    margin: 0 auto;
    div.stats-card {
      background: var(--dynamic-board-bg-color);
      border-radius: 7px;

      display: grid;
      grid-template-columns: 5fr 3fr;
      div.stats-left {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
      i {
        display: grid;
        place-items: center;
      }
    }
  }
}
</style>