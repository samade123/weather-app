<template>
<p>
  <div class="input-switch">
    Location: <vs-switch @click="clickMe" v-model="allowLocation" />
  </div>
</p>
</template>

<script>
import { getLocation } from "../composables/location";
import { ref } from "@vue/reactivity";
// @ is an alias to /src
// import { onMounted } from "@vue/runtime-core";

export default {
  name: "locationSwitch",
  props: ["data"],
  emits: ["locationEmit"],
  setup(props, ctx) {
    const allowLocation = ref(false);
    const clickMe = () => {
      setTimeout(() => {
        if (allowLocation.value) {
          console.log(allowLocation.value, "allowLocation");
          const { latitude, longitude, positions } = getLocation();
          ctx.emit("locationEmit", { latitude, longitude, positions });
        } else {
          console.log(allowLocation.value, "allowLocation");

          ctx.emit("locationEmit", {
            latitude: null,
            longitude: null,
            positions: null,
          });
        }
      }, 1);
    };
    return { allowLocation, clickMe };
  },
};
</script>

<style lang="scss" scoped>
</style>
