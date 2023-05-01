<template>
  <div class="chart-bg" id="myChartBG">
    <canvas id="myChart"></canvas>
  </div>
  <div class="data-type" v-if="themeType == 'new'">
    <div class="data-type-item" v-for="item in datatype.filter(type => type.checked)" :key="item.type"
      :class="{ 'selected': mainType == item.type }">
      <span @click="setMainType(item)">
        {{ item.name }}
      </span>
    </div>
    <div class="data-type-item" @click="showCheckedMenu = true">
      <span class="icon">
        <LottiePlayer :animationData="settingCog" :loop="false" :pauseAnimation="false" :hoverPlay="true" :autoPlay="false" />
      </span>
    </div>
  </div>
  <div class="data-type-item checked" v-if="showCheckedMenu">
    <div class="data-type-item-checked" v-for="item in datatype" :key="item.type">
      <span>
        <label :for="item.name">{{ item.name }}</label>
        <input type="checkbox" :name="item.name" :value="item.checked" v-model="item.checked" :checked="item.checked">
      </span>
    </div>
    <div class="data-type-item-checked">
      <button @click="showCheckedMenu = false">Save</button>
    </div>
  </div>
</template>

<script>
import LottiePlayer from "@/components/Lottie.vue";

import Chart from "chart.js/auto";
import { onMounted, watch, ref } from "vue";
import { widthFunction } from "@/composables/Mobile.js";
import { storageManager } from "@/composables/storage.js";
import settingCog from "@/assets/lottie-files/settings-sliders.json";

export default {
  name: "lineChart",
  props: ["data"],
  components: {
    LottiePlayer,
  },
  setup(props) {
    const { storage } = storageManager();
    const { width, setMobile, getScreenCategory } = widthFunction();
    let themeType = ref(false)
    let datatype = [{ name: 'temp(c)', type: 'temp_c', color: '#f7f7f7', checked: true, label: 'Temperature' }, { name: 'humdity', type: 'humidity', color: '#fc0388', checked: false, label: 'Humidity' }, { name: 'uv', type: 'uv', color: '#e803fc', checked: false, label: 'UV' },{ name: 'rain(in)', type: 'precip_in', color: '#348feb', checked: true, label: 'Precip(in)' }, { name: 'wind(kph)', type: 'wind_kph', color: '#42a4f5', checked: false, label: 'Wind speed' }, { name: 'cloud(%)', type: 'cloud', color: '#f5dd42', checked: false, label: 'Cloud (%)' },]
    const mainType = ref('temp_c')
    let data = []
    let chart = null;

    const showCheckedMenu = ref(false)
    const setMainType = (type) => {
      mainType.value = type.type;
      chart.options.scales.y.ticks = mainType.value == 'temp_c' ? tempTick : normalTick;

      chart.data = {
        labels: props.data.map((element) => element.time.substring(11)),
        datasets: [
          {
            label: "Temperature",
            data: props.data.map((element) => element[type.type]),
            backgroundColor: "rgba(255, 99, 132, 0)",
            borderColor: [type.color],
            pointRadius: 6,
            pointBackgroundColor: "transparent",
            pointHoverRadius: 6,
            borderJoinStyle: "miter",
          },
        ],
      };
      chart.update();
    }
    const normalTick = {
      borderColor: "transparent",
      color: "white",
    };

    const tempTick = {
      borderColor: "transparent",
      color: "white",
      callback: (value, index, labels) => value + "°",
    };

    onMounted(() => {
      const ctx = document.getElementById("myChart").getContext("2d");
      if (storage.doesDataExist('theme')) {
        themeType.value = storage.getData('theme') // check are we using old theem or new theme - only change the background image if we are onold theme
      }
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: props.data.map((element) => element.time.substring(11)),
          datasets: [
            {
              label: "Temperature",
              data: props.data.map((element) => element['temp_c']),
              backgroundColor: "rgba(255, 99, 132, 0)",
              borderColor: "#f7f7f7",
              pointRadius: 6,
              pointBackgroundColor: "transparent",
              pointHoverRadius: 10,
              borderJoinStyle: "miter",
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          // maintainAspectRatio:  !setMobile.value,
          aspectRatio: setMobile.value ? 1.7 : 2.1,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              display: true,
              grid: {
                color: "rgba(255, 99, 132, 0)",
              },
              ticks: tempTick,
            },
            x: {
              beginAtZero: false,
              display: true,
              grid: {
                color: "transparent",
              },
              ticks: {
                borderColor: "transparent",
                color: "white",
              },
            },
          },
        },
      });

      watch(
        () => props.data,
        (newValue) => {

          if (storage.doesDataExist('theme')) {
            themeType.value = storage.getData('theme') // check are we using old theem or new theme - only change the background image if we are onold theme
          }


          chart.options.scales.y.ticks = mainType.value == 'temp_c' ? tempTick : normalTick;
          chart.data = {
            labels: newValue.map((element) => element.time.substring(11)),
            datasets: [
              {
                label: "Temperature",
                data: newValue.map((element) => element.temp_c),
                backgroundColor: "rgba(255, 99, 132, 0)",
                borderColor: "white",
                pointRadius: 6,
                pointBackgroundColor: "transparent",
                pointHoverRadius: 6,
                borderJoinStyle: "miter",
              },
            ],
          };
          chart.update();
        }
      );

    });


    return { themeType, datatype, setMainType, mainType, settingCog, showCheckedMenu, };
  },
};
</script>

<style lang="scss" scoped>
:root:has(#theme-old:checked) {
  .chart-bg {
    display: grid;
    place-items: center;
    position: relative;
    width: 100%;
    height: 100%;

    canvas {
      width: 90% !important;
    }
  }

  .data-type {
    display: none;
  }

}

:root:has(#theme-new:checked) {
  .chart-bg {
    display: grid;
    place-items: center;
    position: relative;
    aspect-ratio: 2.1;
    width: 100%;
    // width: min(80%, 250px);
    margin-inline: auto;
    margin-bottom: 5px;
    // height: min(100%, 100px);

    canvas {
      width: auto !important;
    }
  }

  .checked {
    position: absolute;
    top: 15%;
    z-index: 300;
    left: 50%;
    // height: 50px;
    width: 180px;
    background: #000c;
    backdrop-filter: blur(5px);
    border-radius: 10px;

    &div {
      width: 100%;
    }

    div>span {
      display: flex;
      justify-content: space-between;
      padding: 5px;

      label {

        text-transform: capitalize;
      }
    }

    div>button {
      text-align: center;
      background-color: #00aeff;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 15px;
      margin-bottom: 5px;

      padding: 4px;
    }


  }


  .data-type {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 3px;

    /* width */
    &::-webkit-scrollbar {
      height: 3px;
      width: 3px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #eee5;
      border-radius: 15px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #eee5;
      // border: #f7f7f755 1px solid;
      border-radius: 15px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #eee8;
    }

    .icon {
      &>div {
        height: 30px;
        width: 30px;
      }
    }

    &:has(.checked) {
      position: relative;
    }

    .data-type-item {
      background: #f7f7f722;
      width: fit-content;
      border-radius: 10px;
      text-transform: capitalize;
      padding: 5px 10px;
      transition: background-color 0.4s ease;

      span {
        text-transform: capitalize;

      }

      &:last-of-type {
        padding: 0;
        aspect-ratio: 1;
        display: grid;
        place-content: center;
      }


      &.selected {
        background: #f7f7f750;

      }

      &:hover {
        background: #f7f7f755;
        cursor: pointer;
      }
    }
  }


  @media (max-width: 600px) {
    .chart-bg {
      width: 100%;
      height: 100%;
      aspect-ratio: auto;
      // max-width: 95vw;
      // max-height: 100%;
      // aspect-ratio: 1.7;
    }
  }

}
</style>
