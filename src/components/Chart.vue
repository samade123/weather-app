<template>
  <div class="chart-bg" id="myChartBG">
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { onMounted, watch } from "vue";
import { widthFunction } from "@/composables/Mobile.js";

export default {
  name: "lineChart",
  props: ["data"],
  setup(props) {
    const { width, setMobile, getScreenCategory } = widthFunction();

    onMounted(() => {
      const ctx = document.getElementById("myChart").getContext("2d");
      let chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: props.data.map((element) => element.time.substring(11)),
          datasets: [
            {
              label: "Temperature",
              data: props.data.map((element) => element.temp_c),
              backgroundColor: "rgba(255, 99, 132, 0)",
              borderColor: "white",
              pointRadius: 4,
              pointBackgroundColor: "transparent",
              pointHoverRadius: 6,
              borderJoinStyle: "miter",
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
          aspectRatio: setMobile.value ? 1.4 : 1,
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
              ticks: {
                borderColor: "white",
                color: "white",
              },
            },
            x: {
              beginAtZero: false,
              display: true,
              grid: {
                color: "transparent",
              },
              ticks: {
                borderColor: "white",
                color: "white",
              },
            },
          },
        },
      });

      watch(
        () => props.data,
        (newValue) => {
          chart.data.labels = newValue.map((element) =>
            element.time.substring(11)
          );
          chart.data.datasets[0].data = newValue.map(
            (element) => element.temp_c
          );
          chart.update();
        }
      );
    });

    return {};
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
}

:root:has(#theme-new:checked) {
  .chart-bg {
    display: grid;
    place-items: center;
    position: relative;
    aspect-ratio: 1;
    width: min(80%, 250px);
    margin-inline: auto;
    // height: min(100%, 100px);

    canvas {
      width: auto !important;
    }
  }


  @media (max-width: 600px) {
    .chart-bg {
      width: 100%;

      aspect-ratio: 1.4;
    }
  }

}
</style>
