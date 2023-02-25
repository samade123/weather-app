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
    <!-- <img src="@/assets/spinner.gif" v-if="loading" width="20" alt="">
      <i class="las la-lg la-check" v-if="check"></i> -->
    <svg
    v-if="allowLocation"
    id="check"
    :class="{ progress: loading, ready: check }"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    width="20px"
    height="20px"
    xml:space="preserve"
  >
    <circle id="circle" cx="50" cy="50" r="46" fill="transparent" />
    <polyline id="tick" points="25,55 45,70 75,33" fill="transparent" />
  </svg>
  
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

      if (allowLocation.value) { //if user wants to allow location 
        console.log(allowLocation.value, "allowLocation");
        loading.value = true; // set spinner to appear

        getLocation()
          .then((data) => {
            latitude.value = data.latitude;
            longitude.value = data.longitude;
            positions.value = data.positions;
            locationError.value = data.locationError;
            loading.value = false; // make spinner disappear
            check.value = true; // make check appear

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
              error: err,
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

#tick {
  stroke: #63bc01;
  stroke-width: 6;
  transition: all 1s;
}

#circle {
  stroke: #63bc01;
  stroke-width: 6;
  transform-origin: 50px 50px 0;
  transition: all 1s;
}

.progress #tick {
  opacity: 0;
}

.ready #tick {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 8s ease-out forwards;
}

.progress #circle {
  stroke: #4c4c4c;
  stroke-dasharray: 314;
  stroke-dashoffset: 1000;
  animation: spin 3s linear infinite;
}

.ready #circle {
  stroke-dashoffset: 66;
  stroke: #63bc01;
}

#circle {
  stroke-dasharray: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: 66;
  }
  50% {
    transform: rotate(540deg);
    stroke-dashoffset: 314;
  }
  100% {
    transform: rotate(1080deg);
    stroke-dashoffset: 66;
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

#check {
  width: 20px;
  height: 20px;
}
</style>
