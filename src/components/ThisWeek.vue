<template>
  <div class="outer">
    <div class="top"></div>
    <div class="middle"></div>
    <div class="bottom"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
div.outer {
  display: grid;
  grid-template-rows: 1fr 5fr 2fr;
  height: 100%;
  grid-gap: 5px;
  border: solid 0 5px 0 0 #E6EBF4;
  .top {
    background: purple;
  }
  .bottom {
    background: blue;
  }
}
</style>

