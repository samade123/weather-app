<template>
  <div class="outer">
    <div class="top" v-if="!props.mobile"></div>
    <div class="middle">
      
      <div
        class="today-board"
        :style="{
          backgroundImage: 'url(' + require('@/assets/background.jpg') + ')',
        }"
      >        <div class="left">
          <div class="left-top">
            <div class="location-name"><div class="icon"><i class="las la-map-marker"></i></div><div>{{location? location.name : ".."}}</div></div>
            <div class="location-date">{{location? location.localtime.substring(11) : ".."}}</div>
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
          <!-- <div class="forecast" v-if="forecast">
            <div class="forecast-day"  v-for="temp in forecast.forecastday[0].hour.slice(0,3)" :key="temp.time">
              <img :src="temp.condition.icon" width="100" alt="">
              {{temp.time.substring(11)}} {{temp.temp_c}}</div>
          </div> -->
          <lineChart  v-if="forecast" :data="dataArray"/>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
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
import LineChart from "@/components/Chart.vue";
import { onMounted, watch } from "@vue/runtime-core";
export default {
  props: ["mobile", "data", "ready"],
  components: {
    LineChart,
  },
  setup(props) {
    const publicPath = process.env.BASE_URL;

    const location = ref(null);
    const current = ref(null);
    const forecast = ref(null);
    const hey = ref(null);
    const dataArray = ref([]);
    watch(
      props,
      (props) => {
        console.log("sadasd");
        location.value = props.data.location;
        current.value = props.data.current;
        forecast.value = props.data.forecast;
        // hey.value = forecast.value.forecastday[0].hour.slice(0, 3);
        // console.log(
        //   props.data.forecast.forecastday[0].hour.slice(3),
        //   "dashboard-props"
        // );
        // console.log(forecast.value.forecastday[0].hour, "hour");
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
      },
      { immediate: false, deep: false }
    );

    // watch(props.ready, ()=> {
    //   console.log("ready")
    // })

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
    return { publicPath, props, location, current, forecast, hey, dataArray };
  },
};
</script>

<style lang="scss" scoped>
div.outer {
  display: grid;
  grid-template-rows: 1fr 4fr 4fr;
  height: 100%;
  //   width: 100%;
  grid-gap: 1px;
  border: solid 0 5px 0 0 #e6ebf4;
  //   .top {
  //     background: orange;

  @media (max-width: 600px) {
    grid-template-rows: 4fr 2fr;
  }
  //   }
  .middle {
    display: grid;
    place-items: center;
    color: rgb(36, 96, 155);
    .today-board {
      height: 95%;
      width: clamp(95%, calc(94% + 20px), 98%);
      background: #c4e2ff;
      background-size: cover;
      border-radius: 8px;

      display: grid;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
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
          background: #c4e2ffaa;
          border-radius: 7px;
          .forecast {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            height: 100%;

            .forecast-day {
              display: grid;
              place-items: center;
            }
          }
        }
      }
    }
  }
  .bottom {
    // background: blue;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 1fr 1fr;
    grid-gap: 20px 25px;
    padding: 5px;
    width: clamp(95%, calc(94% + 20px), 98%);
    // width: 95%;
    margin: 0 auto;
    // place-items: center;
    div.stats-card {
      background: #edf3f8;
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