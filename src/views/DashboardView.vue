<template>
  <div class="outer">
    <div class="top" v-if="!props.mobile"></div>
    <div class="middle">
      <!-- <div
        class="today-board"
        :style="{
          'background-image': 'url(./background.jpg`)',
        }"
      ></div> -->
      <div
        class="today-board"
        :style="{
          backgroundImage: 'url(' + require('@/assets/background.jpg') + ')',
        }"
      >
        <!-- <img src="./background.jpg" width="500" alt=""> -->
        <div class="left"></div>
        <div class="right">
          <div class="temp-board">{{ props.mobile }}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="stats-card"></div>
      <div class="stats-card"></div>
      <div class="stats-card"></div>
      <div class="stats-card"></div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  props: ["mobile"],
  setup(props) {
    const publicPath = process.env.BASE_URL;
    return { publicPath, props };
  },
};
</script>

<style lang="scss" scoped>
div.outer {
  display: grid;
  grid-template-rows: 1fr 4fr 4fr;
  height: 100%;
  //   width: 100%;
  grid-gap: 5px;
  border: solid 0 5px 0 0 #e6ebf4;
  //   .top {
  //     background: orange;

  @media (max-width: 600px) {
    grid-template-rows: 4fr 4fr;
  }
  //   }
  .middle {
    display: grid;
    place-items: center;
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
    }

    .right {
      display: grid;
      place-items: center;
      .temp-board {
        height: 95%;
        width: 90%;
        background: #c4e2ffaa;
        border-radius: 7px;
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
    }
  }
}
</style>