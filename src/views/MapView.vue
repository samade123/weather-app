<template>
  <div class="outer">
    <div id="map"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.js";
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
export default {
  props: ["mobile", "data", "ready"],

  setup(props) {
    const publicPath = process.env.BASE_URL;

    const location = ref(null);
    const current = ref(null);
    const forecast = ref(null);
    const upperLimit = ref(4);
    const dateCounter = ref(1);
    const windowWidth = ref(props.windowWidth);
    const dataArray = ref([]);
    let mapCoords = [51.5, -0.09];
    var map = {};
    var marker = {};

    const shout = () => {
      console.log("Sadasds");
    };
    watch(
      props,
      (props) => {
        console.log("sadasd");
        location.value = props.data.location;
        current.value = props.data.current;
        forecast.value = props.data.forecast;

        mapCoords.length = 0; //empty the coordinates array
        mapCoords.push(location.value.lat, location.value.lon);
        map.setView(mapCoords, 13);
        let text = `<h3>${location.value.name} <h3/><div class='map-temp'>${current.value.temp_c} &#176; <img :src="${current.value.condition.icon}" width="30" alt="" /> <div/>`;
        var popup = L.popup()
          .setLatLng([location.value.lat, location.value.lon])
          .setContent(text)
          .openOn(map);

        popup.update();
      },
      { immediate: false, deep: false }
    );
    onMounted(() => {
      map = L.map("map").setView(mapCoords, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);
      shout();

      if (props.ready) {
        location.value = props.data.location;
        current.value = props.data.current;
        forecast.value = props.data.forecast;
        
        mapCoords.length = 0; //empty the coordinates array
        mapCoords.push(location.value.lat, location.value.lon);
        map.setView(mapCoords, 13);
        let text = `<h3>${location.value.name} <h3/><div class='map-temp'>${current.value.temp_c} &#176; <img :src="${current.value.condition.icon}" width="30" alt="" /> <div/>`;
        var popup = L.popup()
          .setLatLng([location.value.lat, location.value.lon])
          .setContent(text)
          .openOn(map);

        popup.update();
      }
    });
    return { mapCoords };
  },
};
</script>

<style lang="scss" scoped>
div.outer {
  display: grid;
  grid-template-rows: 1fr;

  place-items: center;
  height: 100%;
  //   width: 100%;
  grid-gap: 1px;
  border: solid 9px white;
  //   .top {
  //     background: orange;

  min-height: 100vh;
  overflow: scroll;

  #map {
    height: 100%;
    width: 100%;
    z-index: 32;
    border-radius: 8px;
  }
}
</style>