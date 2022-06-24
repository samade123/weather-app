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
  border: solid #E6EBF4;
  border-width: 0 2px 0 0;
  .top {
    background: red;
  }
  .bottom {
    background: blue;
  }
}
</style>

