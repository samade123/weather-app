<template>
  <div class="today-section">
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
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
// @ is an alias to /src

export default {
  name: "weatherStrip",
  props: ["data", "upperLimit", "dateCounter", "windowWidth"],
  setup(props) {
    const location = ref(null);
    const current = ref(null);
    const forecast = ref(null);
    const hey = ref(null);
    const dataArray = ref([]);
    const dateCounter = ref(1);
    const upperLimit = ref(4);
    const windowWidth = ref(props.windowWidth);

    watch(
      props,
      (props) => {
        location.value = props.data.location;
        current.value = props.data.current;
        forecast.value = props.data.forecast;

        props.windowWidth > 1300
          ? (upperLimit.value = 4)
          : (upperLimit.value = 3);
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
      dataArray,
      dateCounter,
      upperLimit,
      windowWidth,
    };
  },
};
</script>

<style lang="scss" scoped>
.today-section {
  overflow: scroll;
  .forecast {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 5px;

    .forecast-day {
      border-radius: 8px;

      &:hover {
        background: rgba(196, 226, 255, 0.6666666667);
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
</style>
