<template>
  <img class="icon" :src="svgSrc" :alt="props.condition" />
</template>
  
<script>
import weatherLUT from "@/assets/svg/output.json";
import { watch, ref, onBeforeMount } from 'vue';

export default {
  name: 'WeatherSVG',
  props: ['condition'],
  setup(props, ctx) {
    const svgSrc = ref(require('@/assets/svg/partly-cloudy-night.svg'))
    const getSVG = () => {
      svgSrc.value = false;
      const svgName = weatherLUT.find(({ day }) => day == props.condition)
      console.log(svgName);
      if (svgName) {
        svgSrc.value = require(`@/assets/svg/${svgName["day-img"]}`);
        return svgSrc.value;
      }
    };

    watch(() => props.condition, (newValue) => {
      getSVG();
    })

    onBeforeMount(() => getSVG());
    return { props, svgSrc };
  }
};
</script>

<style lang="scss" scoped>
svg, img {
  width: auto;
  height: min(70px, 8vw);
  transition: height 0.1s ease-in-out;
}

@media (max-width: 600px) {
  svg, img {
    height: 12vh;
    height: 12dvh;
    height: 12svh;
  }
}
</style>
