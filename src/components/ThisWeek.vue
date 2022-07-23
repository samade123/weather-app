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
      <div class="today-section">
        <div class="forecast" v-if="forecast">
          <div
            class="forecast-day"
            v-for="temp in forecast.forecastday[0].hour.slice(
              0 + dateCounter,
              4 + dateCounter
            )"
            :key="temp.time"
          >
            <img :src="temp.condition.icon" width="100" alt="" />
            {{ temp.time.substring(11) }} {{ temp.temp_c }}
          </div>
        </div>
      </div>
      <div class="next-seven-days">
        <div class="forecast" v-if="forecast">
          <div
            class="forecast-day"
            v-for="day in forecast.forecastday"
            :key="day.date"
          >
            <div class="text">{{ day.date }} {{ day.day.maxtemp_c }}</div>
            <img :src="day.day.condition.icon" width="60" alt="" />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="bottom"></div> -->
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import LineChart from "@/components/Chart.vue";
import { onMounted, watch } from "@vue/runtime-core";

export default {
  props: ["mobile", "data", "ready"],
  setup(props) {
    const location = ref(null);
    const current = ref(null);
    const forecast = ref(null);
    const hey = ref(null);
    const dataArray = ref([]);
    const dateCounter = ref(1);
    watch(
      props,
      (props) => {
        console.log("sadasd");
        location.value = props.data.location;
        current.value = props.data.current;
        forecast.value = props.data.forecast;
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
    return { props, location, current, forecast, hey, dataArray, dateCounter };
  },
};
</script>

<style lang="scss" scoped>
div.outer {
  display: grid;
  grid-template-rows: 1fr 7fr;
  height: 100%;
  grid-gap: 5px;
  border: solid 0 5px 0 0 #e6ebf4;
  //   .top {
  //     background: purple;
  //   }
  //   .bottom {
  //     background: blue;
  //   }
  div.top {
    display: grid;
    place-items: center;
    div.ThisWeek {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      grid-template-columns: 2fr 2fr 2fr;
    }
  }

  div.middle {
    display: grid;
    grid-template-rows: 1fr 5fr;
    // max-height: 100%;
    .today-section {
      .forecast {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }
}
</style>

