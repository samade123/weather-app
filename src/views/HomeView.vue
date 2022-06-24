<template>
  <div class="home">
    <div class="left" v-if="!setMobile">
      <SideNav />
    </div>
    <div class="middle">
      <MainBit />
    </div>
    <div class="right" v-if="!setMobile">
      <ThisWeek />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SideNav from "@/components/SideNav.vue";
import MainBit from "@/components/MainBit.vue";
import ThisWeek from "@/components/ThisWeek.vue";
import { useWindowSize } from "vue-window-size";
import { watch } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";

export default {
  name: "HomeView",
  components: {
    SideNav,
    MainBit,
    ThisWeek,
  },
  setup() {
    const setMobile = ref(false);
    const { width, height } = useWindowSize();

    watch(width, (width) => {
      width < 600 ? (setMobile.value = true) : (setMobile.value = false);
    });

    // onMounted(() => console.log(setMobile));
    return { width, height, setMobile };
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: minmax(150px, 2fr) 6fr 3fr;
  grid-gap: 2px;
  height: 100%;
}

@media (max-width: 600px) {
  .home {
    grid-template-columns: auto;
    width: 100%;
  }
}

// .left {
//   background: black;
// }
</style>
