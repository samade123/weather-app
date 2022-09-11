<template>
  <div class="outer">
    <div class="top">
      <div class="ThisWeek">
        <i class="las la-angle-left la-2x" @click="dateCounter--"></i>
        <div class="title">This Week</div>
        <i class="las la-angle-right la-2x" @click="dateCounter++"></i>
      </div>
    </div>
    <div class="middle">
      <!-- <div class="today-section">
        <div class="forecast" v-if="forecast">
          <div
            class="forecast-day"
            v-for="temp in forecast.forecastday[0].hour.slice(
              0 + dateCounter,
              upperLimit + dateCounter
            )"
            :key="temp.time"
          >
            <div class="time">{{ temp.time.substring(11) }}</div>
            <img :src="temp.condition.icon" width="80" alt="" />
            <div class="temperature">{{ temp.temp_c }}</div>
          </div>
        </div>
      </div> -->
      <WeatherStrip
        :data="props.data"
        :upperLimit="upperLimit"
        :dateCounter="dateCounter"
        :windowWidth="windowWidth"
      />
      <div class="next-seven-days">
        <div class="forecast" v-if="forecast">
          <div
            class="forecast-days"
            v-for="day in forecast.forecastday"
            :key="day.date"
          >
            <div class="date-left">
              <div>{{ getDay(day.date) }}</div>
              <div>{{ getMonth(day.date) }}</div>
            </div>
            <div class="text">{{ day.day.maxtemp_c }} &#176;</div>
            <div class="img">
              <img :src="day.day.condition.icon" width="60" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="bottom"></div> -->
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import WeatherStrip from "@/components/WeatherStrip.vue";
import { onMounted, watch } from "@vue/runtime-core";

export default {
  props: ["mobile", "data", "ready", "windowWidth", "windowHeight"],
  components: {
    WeatherStrip,
  },
  setup(props) {
    const location = ref(null);
    const current = ref(null);
    const forecast = ref(null);
    const hey = ref(null);
    const dataArray = ref([]);
    const dateCounter = ref(1);
    const upperLimit = ref(4);

    const windowWidth = ref(props.windowWidth);

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

      return date.substring(8) + " " + month[newDate.getMonth()];
    };
    watch(
      props,
      (props) => {
        if (props.ready) {
          location.value = props.data.location;
          current.value = props.data.current;
          forecast.value = props.data.forecast;

          props.windowWidth > 1300
            ? (upperLimit.value = 4)
            : (upperLimit.value = 3);
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
      props,
      location,
      current,
      forecast,
      hey,
      dataArray,
      dateCounter,
      upperLimit,
      windowWidth,
      getDay,
      getMonth,
    };
  },
};
</script>

<style lang="scss" scoped>
// @import "./stylesheets/theme-color.scss";
div.outer {
  display: grid;
  grid-template-rows: 1fr 7fr;
  height: 100%;
  grid-gap: 5px;
  border-left: 1px solid #e6ebf4;

  div.top {
    display: grid;
    place-items: center;
    div.ThisWeek {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      overflow: scroll;
      grid-template-columns: 2fr 2fr 2fr;
    }
  }

  div.middle {
    display: grid;
    grid-template-rows: 1fr 5fr;
    // max-height: 100%;
    .today-section {
      overflow: scroll;
      .forecast {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 5px;

        .forecast-day {
          border-radius: 8px;

          &:hover {
            background: var(--dynamic-background-color);
            cursor: pointer;
          }
        }
      }

      @media (max-width: 1300px) {
        .forecast {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }

    .next-seven-days {
      .forecast {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .forecast-days {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          margin: 10px;
          .date-left {
            display: grid;
            place-items: center;
          }
          .text {
            display: grid;
            place-items: center;
          }
          .img {
            display: grid;
            place-items: center;
          }
        }
      }
    }
  }
}
</style>

