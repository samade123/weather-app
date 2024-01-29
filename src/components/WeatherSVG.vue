<template>
  <img class="icon" :class="[current ? svgClass : false]" :src="svgSrc" :alt="props.condition" :title="svgName" />
</template>
  
<script>
import weatherLUT from "@/assets/svg/output.json";
import { watch, ref, onBeforeMount, onMounted } from 'vue';

export default {
  name: 'WeatherSVG',
  props: ['condition', 'daytime', 'current', 'uv'],
  setup(props, ctx) {
    const svgSrc = ref(require('@/assets/svg/partly-cloudy-night.svg'))
    const svgClass = ref('sunny-demo')
    const loadSvgClass = ref('')
    let svgName;

    let conditionIsDay = 1;
    const  getSVG = () => {
      svgSrc.value = require('@/assets/svg/partly-cloudy-night.svg');
      conditionIsDay = props['daytime'];
      // svgName = conditionIsDay > 0 ? weatherLUT.find(({ day }) => day == props.condition) : weatherLUT.find(({ night }) => night == props.condition)
      svgName = weatherLUT[props.condition.trim()]
      //  svgName = weatherLUT.find(({ night }) => night == props.condition)
      console.log(svgName, 'svgName', conditionIsDay > 0, props.condition)
      

      if (svgName) {
        svgSrc.value = require(`@/assets/svg/${svgName[conditionIsDay > 0 ? 'day-img' : 'night-img']}`);
        // svgSrc.value = require(`@/assets/svg/${svgName['night-img']}`);


        if (props.current) {
          let outerBgDiv = document.getElementsByClassName('outer-bg')[0];

          if (outerBgDiv) {
            outerBgDiv.classList.add('dissapear')
            outerBgDiv.addEventListener("transitionend", (event) => {


              loadSvgClass.value = svgName[conditionIsDay > 0 ? 'day-css' : 'night-css'];
              if (props.condition == 'Partly cloudy' && props.uv > 2) {
                loadSvgClass.value = 'sunny_cloudy'
              }
              svgClass.value = loadSvgClass.value;
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
    }, {immediate: true})

    onMounted(() => getSVG());
    return { props, svgSrc, svgClass, svgName };
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
