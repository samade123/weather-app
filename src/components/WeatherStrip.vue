<template>
  <div class="today-section" v-touch:swipe.left="increment" v-touch:swipe.right="decrement">
    <div class="forecast" v-if="props.data">
      <div class="forecast-day" v-for="temp in props.data.forecast.forecastday[0].hour.slice(
        0 + dateCounter,
        upperLimit + dateCounter
      )" :key="temp.time">
        <div class="time">{{ temp.time.substring(11) }}</div>
        <!-- <img :src="temp.condition.icon" width="80" alt="" /> -->
        <WeatherSVG :condition="temp.condition ? temp.condition.text : false" />

        <div class="temperature">{{ temp.temp_c }}</div>
      </div>
    </div>

    <div class="forecast" v-else>
      <div class="placeholder"  v-for="(n, index) in 3" :key="index"></div>
    </div>
  </div>
</template>

<script>
import { useWindowSize } from "vue-window-size";
import { ref } from "@vue/reactivity";
import { onMounted, watch, watchEffect } from "@vue/runtime-core";
import WeatherSVG from "@/components/WeatherSVG.vue";
import { storageManager } from "@/composables/storage.js";
// @ is an alias to /src

export default {
  name: "weatherStrip",
  props: ["data", "upperLimit", "dateCounter", "windowWidth", "ready"],
  components: {
    WeatherSVG,
  },
  setup(props) {
    const location = ref(null);
    const current = ref(null);
    const forecast = ref(null);
    const dataArray = ref([]);
    const dateCounter = ref(0);
    const upperLimit = ref(4);
    const { width, height } = useWindowSize();
    const { storage } = storageManager();

    const decrement = () => {
      dateCounter.value--;
    };
    const increment = () => {
      dateCounter.value++;
    };

    let themeType = storage.getData('theme') // check are we using old theem or new theme - only change the background image if we are onold theme

    watch(
      width,
      (width) => {
        if (width > 1300) {
          upperLimit.value = 4;
        } else if (width < 600) {
          upperLimit.value = 4;
        } else {
          upperLimit.value = 3;
        }

        if (themeType == 'new') {
          upperLimit.value = 3;
        }
      },
      { immediate: true }
    );

    watch(
      props,
      (props) => {
        if (props.data) {
          let dateNow = new Date();
          let currentTime = dateNow.getHours();
          dateCounter.value = currentTime; //sets the weather strip to current time
        }
      },
      { immediate: true, deep: true }
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
      decrement,
      increment,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "./../stylesheets/placeholder.scss" as *;
@use "./../stylesheets/transitions.scss" as *;


:root:has(#theme-old:checked) {

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
          // cursor: pointer;
        }
      }
    }

    @media (max-width: 1300px) {
      .forecast {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 600px) {
      .forecast {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }
}

:root:has(#theme-new:checked) {
  .today-section {
    overflow: scroll;
    // margin-inline: var(--dynamic-right-margin-inline);

    .forecast {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 5px;

      .forecast-day {
        // border-radius: 8px;

        &:hover {
          // cursor: pointer;
        }
      }
    }
  }

  @media (max-width: 600px) {
    .today-section {
      overflow: scroll;
      margin-inline: auto;
    }
  }
}
</style>
