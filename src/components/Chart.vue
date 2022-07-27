<template>
  <div class="chart-bg" id="myChartBG">
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
// @ is an alias to /src
import Chart from "chart.js";
import { onMounted } from "@vue/runtime-core";

export default {
  name: "lineChart",
  props: ["data"],
  setup(props) {
    const data = { names: [], values: [] };

    props.data.forEach((element) => {
      data.names.push(element.time.substring(11));
      data.values.push(element.temp_c);
    });

    console.log(data, "data");
    
    onMounted(() => {
      const ctx = document.getElementById("myChart").getContext("2d");

      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.names,
          datasets: [
            {
              label: "Temperature",
              data: data.values,
              backgroundColor: ["rgba(255, 99, 132, 0)"],
              borderColor: ["#4278AC"],
              pointBorderWidth: 2,
              pointRadius: 4,
              pointColor: ["white"],
              pointHoverRadius: 6,
              borderJoinStyle: "miter",
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                display: true,
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
            xAxes: [
              {
                display: true,
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
          },
        },
      });
    });
    return { };
  },
};
</script>

<style lang="scss" scoped>
.chart-bg {
  display: grid;
  place-items: center;
  // background: black;
  position: relative;
  width: 100%;
  height: 100%;

  #myChart {
    width: 90% !important;
  }
}
</style>
