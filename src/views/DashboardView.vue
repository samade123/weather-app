<template>
  <div class="outer">
    <div class="top"></div>
    <div class="middle">
      <!-- <div
        class="today-board"
        :style="{
          'background-image': 'url(./background.jpg`)',
        }"
      ></div> -->
      <div class="today-board" :style="{ backgroundImage: 'url(' + require('@/assets/background.jpg') + ')' }">
        <!-- <img src="./background.jpg" width="500" alt=""> -->
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
export default {
  setup() {
    const publicPath = process.env.BASE_URL;
    return { publicPath };
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
  //   }
  .middle {
    display: grid;
    place-items: center;
    .today-board {
      height: 95%;
      width: 95%;
      background: #c4e2ff;
      background-size: cover;
      border-radius: 8px;

      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
  .bottom {
    // background: blue;
  }
}
</style>