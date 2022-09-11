<template>
<p>
  <div class="input-switch">
   <span>Location: </span> 
    <vs-switch v-model="allowLocation"> 

    <template #on>
      <i class="las la-lg la-map-marker"></i>
    </template>

    <template #off>
      <i class="las la-lg la-map-marker"></i>
    </template>
    </vs-switch>
    <img src="@/assets/spinner.gif" v-if="loading" width="20" alt="">
      <i class="las la-lg la-check" v-if="check"></i>

  </div>
</p>
</template>

<script>
import { storageManager } from "../composables/storage.js";
import { getLocation } from "../composables/location";
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
// @ is an alias to /src

export default {
  name: "locationSwitch",
  props: ["data"],
  emits: ["locationEmit"],
  setup(props, ctx) {
    const allowLocation = ref(false);
    const latitude = ref(false);
    const longitude = ref(false);
    const positions = ref(false);
    const locationError = ref(false);
    const loading = ref(false);
    const check = ref(false);

    const { storage } = storageManager();

    if (storage.doesDataExist("allow-location")) {
      allowLocation.value = storage.getData("allow-location");
    }

    const clickMe = () => {
      storage.storeData("allow-location", allowLocation.value);

      if (allowLocation.value) {
        console.log(allowLocation.value, "allowLocation");
        loading.value = true;

        getLocation()
          .then((data) => {
            latitude.value = data.latitude;
            longitude.value = data.longitude;
            positions.value = data.positions;
            locationError.value = data.locationError;
            loading.value = false;
            check.value = true;

            ctx.emit("locationEmit", {
              latitude,
              longitude,
              positions,
              locationError: false,
            });
          })
          .catch((err) => {
            console.log({
              latitude,
              longitude,
              positions,
              locationError: true,
              error: "error",
            });
            ctx.emit("locationEmit", {
              latitude,
              longitude,
              positions,
              locationError: true,
            });
          });
      } else {
        console.log(allowLocation.value, "allowLocation");

        ctx.emit("locationEmit", {
          latitude: null,
          longitude: null,
          positions: null,
          locationError: true,
        });
      }
    };

    watch(
      allowLocation,
      () => {
        clickMe();
      },
      { immediate: false, deep: false }
    );

    return { allowLocation, clickMe, loading, check };
  },
};
</script>

<style lang="scss" scoped>
// .input-switch{
//   display: flex;
//   flex-direction: column;
// }

.la-check {
  color: green;
  font-weight: bold;
}
</style>
