<template>
  <img class="icon" :class="[current ? svgClass : false]" :src="svgSrc" :alt="props.condition" />
</template>
  
<script>
import weatherLUT from "@/assets/svg/output.json";
import { watch, ref, onBeforeMount } from 'vue';

export default {
  name: 'WeatherSVG',
  props: ['condition', 'daytime', 'current'],
  setup(props, ctx) {
    const svgSrc = ref(require('@/assets/svg/partly-cloudy-night.svg'))
    const svgClass = ref('sunny-demo')

    let conditionIsDay = true;
    const getSVG = () => {
      svgSrc.value = false;
      conditionIsDay = props['daytime'];
      let svgName = conditionIsDay ? weatherLUT.find(({ day }) => day == props.condition) : weatherLUT.find(({ night }) => night == props.condition)
      if (svgName) {
        svgSrc.value = require(`@/assets/svg/${svgName[conditionIsDay ? 'day-img' : 'night-img']}`);

        if (props.current) {
          let outerBgDiv = document.getElementsByClassName('outer-bg')[0];

          if (outerBgDiv) {
            outerBgDiv.classList.add('dissapear')
            outerBgDiv.addEventListener("transitionend", (event) => {
              svgClass.value = svgName[conditionIsDay ? 'day-css' : 'night-css'];
              outerBgDiv.classList.remove('dissapear')
            }, {
              passive: true,
              once: true,
            });
          }
        }
        return svgSrc.value;
      }
    };

    watch(() => props.condition, (newValue) => {
      getSVG();
    })

    onBeforeMount(() => getSVG());
    return { props, svgSrc, svgClass };
  }
};
</script>

<style lang="scss" scoped>
svg,
img {
  width: auto;
  height: min(70px, 8vw);
  transition: height 0.1s ease-in-out;
  margin-inline: auto;
  // width: 100%;
}

@media (max-width: 600px) {

  svg,
  img {
    height: 12vh;
    height: 12dvh;
    height: 12svh;
  }
}
</style>
