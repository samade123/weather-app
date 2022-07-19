<template>
  <div class="chart-bg">
    <canvas id="myChart" :height="chartHeight"></canvas>
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
    console.log(props, "chart view");
    // console.log(Date.getDate(props.data[0].time_epoch))
    const hello = new Date(props.data[0].time);
    console.log(hello.getDate());
    const data = { names: [], values: [] };

    props.data.forEach((element) => {
      data.names.push(element.time.substring(11));
      data.values.push(element.temp_c);
    });

    console.log(data, "data");
    const chartHeight = () => {
      const ctx = document.getElementById("myChart");

      var heightRatio = 1;
      return ctx.width * heightRatio;
    };
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
              pointHoverRadius: 6,
              borderJoinStyle: "miter",
            },
          ],
        },
        options: {
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
    return { chartHeight };
  },
};
</script>

<style lang="scss" scoped>
.chart-bg {
  display: grid;
  place-items: center;
  // background: black;
  // width: 100%;
  height: 100%;

  #myChart {
    width: 90% !important; 
  }
}
</style>
