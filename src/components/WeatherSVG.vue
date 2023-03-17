<template>
  <img v-svg-inline class="icon" src="@/assets/svg/partly-cloudy-day.svg" alt="example svg image" />
</template>
  
<script>
export default {
  name: 'SvgImage',
};
</script>

<style lang="scss" scoped>
svg {
  width: auto;
  height: min(88px, 8vw);
  transition: height 0.1s ease-in-out;
}

@media (max-width: 600px) {
  svg {
    height: 12vh;
    height: 12dvh;
  }
}
</style>
  